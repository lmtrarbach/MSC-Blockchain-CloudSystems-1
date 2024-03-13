import boto3
import time
import logging
import json
from urllib.parse import parse_qs

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def athena_query(parameters, wait=True):
    """
    Query against in AWS Athena table
    :param parameters:
    :param wait:
    :return:
    """
    try:
        error_message = ''
        location = ''
        row_values = []
        logger.info("Starting query")
        session = boto3.Session()
        client = session.client('athena')

        # Executes query and returns the query execution ID
        response_query_execution_id = client.start_query_execution(
            QueryString=parameters['query'],
            QueryExecutionContext={
                'Database': parameters['database']
            },
            ResultConfiguration={
                'OutputLocation': 's3://' + parameters['bucket'] + '/' + parameters['path']
            },
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
            response_get_query_details = client.get_query_execution(
                QueryExecutionId=response_query_execution_id['QueryExecutionId']
            )
            status = 'RUNNING'
            iterations = 360

            while iterations > 0:
                iterations = iterations - 1
                response_get_query_details = client.get_query_execution(
                    QueryExecutionId=response_query_execution_id['QueryExecutionId']
                )
                status = response_get_query_details['QueryExecution']['Status']['State']

                if (status == 'FAILED') or (status == 'CANCELLED'):
                    error_reason = response_get_query_details['QueryExecution']['Status']['StateChangeReason']
                    logger.error("Function Name: {} Error: {}"
                                 .format(athena_query.__name__, str(error_reason)))
                    error_message = error_reason

                elif status == 'SUCCEEDED':
                    response_query_result = client.get_query_results(
                        QueryExecutionId=response_query_execution_id['QueryExecutionId']
                    )
                    rows = response_query_result['ResultSet']['Rows']
                    columns = [col['VarCharValue'] for col in rows[0]['Data']]

                    # Extracting registries from rows
                    # Don't askme why is VarCharValue I don't got this
                    for row in rows[1:]:
                        row_values.append({columns[i]: row['Data'][i]['VarCharValue'] for i in range(len(columns))})

                    break
                else:
                    time.sleep(5)
    except Exception as exception:
        logger.error("Function Name: {} Error: {}"
                     .format(athena_query.__name__, str(exception)))
        error_message = str(exception)

    return row_values, error_message

def lambda_handler(event, context):
    """
    Main function, default always lambda_handler
    :param event:
    :param context:
    :return:
    """
    try:
        query_parameters = parse_qs(event['rawQueryString'])
        # Mount query with parameters parsed on GET method
        # It query the value burned on the given day.
        sql_query_to_execute = f'''
            SELECT 
                from_address,
                DATE_TRUNC('day', block_timestamp) AS transfer_date,
                COUNT(*) AS transfer_count,
                SUM(value) AS total_eth_transferred
            FROM transactions
            WHERE to_address = '0x000000000000000000000000000000000000dead'
                AND value > 0
            GROUP BY from_address, DATE_TRUNC('day', block_timestamp)
            ORDER BY transfer_date DESC, total_eth_transferred DESC
            LIMIT 100;
        '''
        
        athena_parameters = {
            'region': 'us-east-2',  # My athena deploy is on this region
            'database': 'eth',   # The glue DB that I'm using
            'bucket': 'aws-public-blockchain-athenaresultsbucket-n6balkgnyp3v',  # The s3 bucket that i'm using
            'path': 'api_query_results/',  # Can be any folder
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
            'body': json.dumps({'error': 'Token address not provided'})
        }
