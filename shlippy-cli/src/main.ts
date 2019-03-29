import * as Program from "commander";

Program.command("deploy")
  .option("-h, --host", "Hostname of the target server")
  .option("-u, --user", "User which will be used to tunnel into the server")
  .option("-k, --key", "Private key of the ssh user")
  .action(function(cmd) {
    console.log(
      "Deploying to: " + cmd.host + " using " + cmd.user + ":" + cmd.key
    );
  });

Program.command("generate [flags...]").action(function(cmd) {
  console.log(cmd);
});

Program.version("1.0.0").parse(process.argv);
