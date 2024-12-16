import logging
logging.basicConfig(level=logging.DEBUG)
import mcp_server_time
print("Module imported")
from mcp_server_time import __main__
print("Main module imported")
__main__.main()

