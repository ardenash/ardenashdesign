// Generated by CoffeeScript 1.4.0

/*
# Load modules
*/


(function() {
  var ArdenAshDesign, RoutesHome, color, config, env, express, flash, path, stylus, winston, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  _ = require('underscore');

  path = require('path');

  winston = require('winston');

  config = require('nconf');

  express = require('express');

  color = require('colors');

  /*
  # Setup version
  */


  require('pkginfo')(module, 'version');

  /*
  # Configure environment
  */


  env = process.env.NODE_ENV || 'development';

  /*
  # Load config
  */


  config.file({
    file: path.join(__dirname, '../config/env', env + '.json')
    /*
    # Setup airbrake
    */

  });

  process.addListener('uncaughtException', function(err, stack) {
    return console.log("Caught exception: " + err + "\n" + err.stack);
  });

  stylus = require('stylus');

  flash = require('connect-flash');

  RoutesHome = require('./routes/routes-home');

  module.exports = ArdenAshDesign = (function() {

    function ArdenAshDesign() {
      this.stop = __bind(this.stop, this);

      this.start = __bind(this.start, this);

    }

    /*
      Starts the express server.
      @param {Integer} port the port to listen to. If null then the app does not listen
      @param {} cb an optional callback that is invoked when start is completed, after listen
    */


    ArdenAshDesign.prototype.start = function(port, cb) {
      var baseUrl, key, route, settings, _ref, _ref1;
      if (port == null) {
        port = null;
      }
      if (cb == null) {
        cb = null;
      }
      this.app = express();
      this.baseUrl = baseUrl = config.get('site:url');
      this.app.use(express.favicon(__dirname + '/../public/assets/ico/favicon.ico', config.get('cache')));
      this.app.use(express["static"](__dirname + '/../public', config.get('cache')));
      this.app.use(express.logger());
      this.app.use(express.responseTime());
      this.app.use(express.cookieParser(config.get('site:secret')));
      this.app.use(flash());
      this.app.use(express.bodyParser());
      this.app.use(express.methodOverride());
      this.app.locals({
        config: config,
        packageVersion: exports.version,
        '_': _
      });
      /*
          @app.use (req, res,next) =>
            res.locals.messages = expressMessages
            res.locals.infoFlash = () -> req.flash('info') || []
            res.locals.warningFlash = () -> req.flash('warning') || []
            res.locals.errorFlash = () -> req.flash('error') || []
            res.locals.isInRole = (role) -> req.user && req.user.roles && !!_.find(req.user.roles,(x)-> x is role)
      
            next()
      */

      settings = {
        app: this.app,
        baseUrl: this.baseUrl
      };
      this.routes = {
        home: new RoutesHome(this.app)
      };
      _ref = this.routes;
      for (key in _ref) {
        route = _ref[key];
        route.setupLocals();
      }
      _ref1 = this.routes;
      for (key in _ref1) {
        route = _ref1[key];
        route.setupRoutes();
      }
      this.app.set('views', __dirname + '/../views');
      this.app.set('view engine', 'ejs');
      this.app.use(this.app.router);
      if (port) {
        this.server = this.app.listen(port);
        winston.info(("Express server listening on port " + port + " in " + this.app.settings.env + " mode").cyan);
      }
      if (cb) {
        return cb(null, this);
      }
    };

    ArdenAshDesign.prototype.stop = function(cb) {
      if (cb == null) {
        cb = null;
      }
      if (this.server) {
        this.server.close();
      }
      if (cb) {
        return cb(null, this);
      }
    };

    return ArdenAshDesign;

  })();

}).call(this);
