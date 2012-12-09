###
# Load modules
###
_ = require 'underscore'
path = require 'path'
winston = require 'winston'
config = require 'nconf'
express = require 'express'
color = require 'colors'

###
# Setup version
###
require('pkginfo')(module, 'version')

###
# Configure environment
###
env = process.env.NODE_ENV or 'development'

###
# Load config
###
config.file file: path.join(__dirname, '../config/env', env + '.json')

###
# Setup airbrake
###

process.addListener 'uncaughtException', (err, stack) ->
  console.log "Caught exception: #{err}\n#{err.stack}"

stylus = require 'stylus'
flash = require 'connect-flash'

RoutesHome = require './routes/routes-home'


module.exports = class ArdenAshDesign

  ###
  Starts the express server.
  @param {Integer} port the port to listen to. If null then the app does not listen
  @param {} cb an optional callback that is invoked when start is completed, after listen
  ###
  start: (port = null, cb = null) =>
    @app  = express()  
    @baseUrl = baseUrl = config.get('site:url')

    @app.use express.favicon(__dirname + '/../public/assets/ico/favicon.ico', config.get('cache'))
    @app.use express.static(__dirname + '/../public', config.get('cache'))
    @app.use express.logger()
    @app.use express.responseTime()
    
    @app.use express.cookieParser config.get('site:secret')

    @app.use flash()
    @app.use express.bodyParser()
    @app.use express.methodOverride()
 
    @app.locals 
      config : config
      packageVersion : exports.version
      '_' : _


    ###
    @app.use (req, res,next) =>
      res.locals.messages = expressMessages
      res.locals.infoFlash = () -> req.flash('info') || []
      res.locals.warningFlash = () -> req.flash('warning') || []
      res.locals.errorFlash = () -> req.flash('error') || []
      res.locals.isInRole = (role) -> req.user && req.user.roles && !!_.find(req.user.roles,(x)-> x is role)

      next()
    ###

    settings = 
      app: @app
      baseUrl : @baseUrl

    # TODO: Order might be important, and we need to check that.
    @routes =
      home : new RoutesHome(@app)

    route.setupLocals() for key,route of @routes
    route.setupRoutes() for key,route of @routes
      
    @app.set('views', __dirname + '/../views')
    @app.set('view engine', 'ejs')

    @app.use @app.router
 
    if port
      @server = @app.listen port
      winston.info "Express server listening on port #{port} in #{@app.settings.env} mode".cyan

    cb null, @ if cb

  stop: (cb = null) =>
    @server.close() if @server
    cb null, @ if cb
