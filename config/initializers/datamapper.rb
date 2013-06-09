configure do
  dbc = settings.database
  # DataMapper::Logger.new($stdout, :debug)

  puts ">> Database connection: "
  puts ">> \tAdapter: mysql"
  puts ">> \tHost: #{dbc[:host]}"
  puts ">> \tDatabase: #{dbc[:db]}"
  puts ">> \tUsername: #{dbc[:un]}"
  puts ">> \tPassword: #{dbc[:pw].length}"

  DataMapper.setup(:default, "mysql://#{dbc[:un]}:#{dbc[:pw]}@#{dbc[:host]}/#{dbc[:db]}")
  DataMapper.finalize
  DataMapper.auto_upgrade! unless $DB_BOOTSTRAPPING
end