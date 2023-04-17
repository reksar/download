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
  SaveBin(request.ResponseBody);
} catch (err) {
  // TODO: do this after trying to download using PowerShell.
  SaveText(request.ResponseText);
}


function SaveBin(response) {
  StreamType = {Binary: 1, Text: 2};
  var bin_stream = new ActiveXObject("ADODB.Stream");
  bin_stream.Type = StreamType.Binary;
  bin_stream.Open();
  bin_stream.Write(response);
  bin_stream.SaveToFile(outfile);
  bin_stream.Close();
}


function SaveText(text) {
  var fs = new ActiveXObject("Scripting.FileSystemObject");
  var root = fs.GetParentFolderName(WScript.ScriptFullName);
  var bytes_path = fs.BuildPath(root, "tb\\bytes");
  var lib_path = fs.BuildPath(root, "tb\\lib.js");
  var lib = eval(fs.OpenTextFile(lib_path).ReadAll());
  var codepage = lib.CodePage(bytes_path);
  with (fs.CreateTextFile(outfile, /*rewrite*/false))
    for (var i = 0; i < text.length; i++)
      Write(codepage[text.charCodeAt(i)]);
}
