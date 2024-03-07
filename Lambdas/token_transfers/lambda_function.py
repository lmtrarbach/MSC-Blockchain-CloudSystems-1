import boto3
import time
import logging
import json
from urllib.parse import parse_qs

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def athena_query(parameters, wait=True):
    try:
        error_message = ''
        row_values = []
        
        session = boto3.Session()
        client = session.client('athena')

        response_query_execution_id = client.start_query_execution(
            QueryString=parameters['query'],
            QueryExecutionContext={'Database': parameters['database']},
            ResultConfiguration={'OutputLocation': 's3://' + parameters['bucket'] + '/' + parameters['path']},
            ResultReuseConfiguration={
                'ResultReuseByAgeConfiguration': {
   	    	    'Enabled': True,
     		    'MaxAgeInMinutes': 60
                }
            }
        )

        if not wait:
            return response_query_execution_id['QueryExecutionId']
        else:
            iterations = 360

            while iterations > 0:
                iterations -= 1
                response_get_query_details = client.get_query_execution(
                    QueryExecutionId=response_query_execution_id['QueryExecutionId']
                )
                status = response_get_query_details['QueryExecution']['Status']['State']

                if status in ['FAILED', 'CANCELLED']:
                    error_reason = response_get_query_details['QueryExecution']['Status']['StateChangeReason']
                    logger.error(f"Query execution failed: {error_reason}")
                    return [], error_reason

                elif status == 'SUCCEEDED':
                    response_query_result = client.get_query_results(
                        QueryExecutionId=response_query_execution_id['QueryExecutionId']
                    )
                    rows = response_query_result['ResultSet']['Rows']
                    columns = [col['VarCharValue'] for col in rows[0]['Data']]

                    for row in rows[1:]:
                        row_values.append({columns[i]: row['Data'][i]['VarCharValue'] for i in range(len(columns))})

                    return row_values, None

                else:
                    time.sleep(5)

            return [], "Query execution timed out"

    except Exception as exception:
        logger.error(f"Error executing Athena query: {exception}")
        return [], str(exception)

def lambda_handler(event, context):
    try:
        query_parameters = parse_qs(event['rawQueryString'])
        token_address = query_parameters['token_address'][0]
        date = query_parameters['date'][0]
        
        sql_query_to_execute = f'''
            SELECT COUNT(*) AS num_of_transactions,
                   SUM(value) AS total_value,
                   (
                       SELECT to_address
                       FROM token_transfers
                       WHERE date = '{date}' AND token_address = '{token_address}'
                       GROUP BY to_address
                       ORDER BY SUM(value) DESC
                       LIMIT 1
                   ) AS received_most_value,
                   (
                       SELECT from_address
                       FROM token_transfers
                       WHERE date = '{date}' AND token_address = '{token_address}'
                       GROUP BY from_address
                       ORDER BY SUM(value) DESC
                       LIMIT 1
                   ) AS sent_most_value
            FROM token_transfers
            WHERE date = '{date}' AND token_address = '{token_address}';
        '''
        
        athena_parameters = {
            'region': 'us-east-2',
            'database': 'eth',
            'bucket': 'aws-public-blockchain-athenaresultsbucket-n6balkgnyp3v',
            'path': 'api_query_results/',
            'query': sql_query_to_execute
        }
        
        result_set, error_message = athena_query(athena_parameters)
        
        if error_message:
            return {
                'statusCode': 500,
                'body': json.dumps({'error': error_message})
            }
        else:
            return {
                'statusCode': 200,
                'body': json.dumps(result_set)
            }
    except KeyError as e:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Token address or date not provided'})
        }
