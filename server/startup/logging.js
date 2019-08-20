const debug = require('debug')('servera:logging');
const morgan = require('morgan');
const winston = require('winston');
require('express-async-errors');

module.exports = function(app) {
  if (app.get('env') === 'development'){
    app.use(morgan('tiny'));
    debug('Morgan enabled...');
  }

  winston.add(
    new winston.transports.File({ filename: './Logs/logfile.log' })
  );

  winston.exceptions.handle(
    new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.json(),
          winston.format.prettyPrint()
        )
      }),
    new winston.transports.File({ filename: './Logs/uncaughtExceptions.log' })
  )
  
  process.on('unhandledRejection', (ex) => {
    throw ex;
  });
}