_ = require 'underscore'

class RoutesHomePathHelper
  root: '/'

module.exports = class RoutesHome

  constructor:(@app) ->
    throw new Error("app parameter is required") unless @app

  setupLocals: () =>
    @app.locals.routesHome = @routesHomePathHelper = new RoutesHomePathHelper
      
  setupRoutes: () =>
    @app.get '/', @index

  index: (req, res) =>
    res.render 'index',
      controllerName : "home"

