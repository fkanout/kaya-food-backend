// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config()

import { startCrawler } from "./crawler"
import { startServer } from "./server"
// startCrawler()
startServer()
