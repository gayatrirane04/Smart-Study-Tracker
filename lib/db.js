import { PrismaClient } from '../lib/generated/prisma';
// import class from prisma/client package
// prismaclient is the one used to send queries to the database 

var global = global || {}; 
// create global object if not present , in nodejs global is built in object , like window in browser  
global.prisma = global.prisma || new PrismaClient();
// if present it uses that exsisting instance 
export const db = global.prisma;
//  const db is aasigned to the prisma client instance from global object
// export keyword make db constant available for all other files to import and use
if(process.env.NODE_ENV !== 'production') {
  global.prisma = global.prisma;
}
// check if not in prod mode , this is to make sure that it is in dev mode only beacuse hot-relad might create new instance and cause issues