###
# Top level file for modeista.com
###
app = module.exports = new (require './app')()

port = process.env.PORT || 7000

app.start(if require.main is module then port else null)
