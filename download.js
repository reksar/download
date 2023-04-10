url = WScript.Arguments(0);
outfile = WScript.Arguments(1);

try {
  request = new ActiveXObject("WinHttp.WinHttpRequest.5.1");
} catch (err) {
  request = new ActiveXObject("Microsoft.XMLHTTP");
}

request.Open("GET", url, /*async*/false);
request.Send();

try {
  StreamType = {Binary: 1, Text: 2};
  bin_stream = new ActiveXObject("ADODB.Stream");
  bin_stream.Type = StreamType.Binary;
  bin_stream.Open();
  bin_stream.Write(request.ResponseBody);
  bin_stream.SaveToFile(outfile);
  bin_stream.Close();
} catch (err) {
  fs = new ActiveXObject("Scripting.FileSystemObject");
  root = fs.GetParentFolderName(WScript.ScriptFullName);
  tb(request.ResponseText);
}


function tb(text) {

  // Import util.
  var module = fs.BuildPath(root, "tb\\tests\\util.js");
  var util = eval(fs.OpenTextFile(module).ReadAll());

  var hexlines = new util.HexLineGenerator(new ByteGenerator(text));
  var hex = new HexWriter(outfile);

  while (!hexlines.Empty())
    hex.Write(hexlines.Next());
}


function ByteGenerator(text) {

  var i = 0;

  this.Empty = function() {
    return text.length <= i;
  }

  this.Next = function() {
    return text.charCodeAt(i++);
  }
}


function HexWriter(file) {

  var shell = new ActiveXObject("WScript.Shell");
  var tb = fs.BuildPath(root, "tb\\tb.bat");

  // See https://learn.microsoft.com/en-us/previous-versions/d5fk67ky(v=vs.85)#remarks
  var WindowStyle = {Hide: 0 /*...*/};

  this.Write = function(hexline) {
    var cmd = tb + " " + hexline + " " + file;
    var rc = shell.Run(cmd, WindowStyle.Hide, /*wait*/true);
    if (rc) Exit(rc);
  }
}


function Exit(rc) {

  if (rc && fs.FileExists(outfile))
    fs.DeleteFile(outfile);

  WScript.Quit(rc);
}
