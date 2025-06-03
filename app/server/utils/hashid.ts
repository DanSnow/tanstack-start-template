import Hashids from 'hashids'
import { env } from '~/env'

export const hashids = new Hashids(env.HASH_ID_SECRET, 10)
