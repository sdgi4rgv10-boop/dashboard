using System;
using System.Diagnostics;
using System.IO;
using System.Windows.Forms;

class Program
{
    static string FindBrowser(string browserExe)
    {
        string[] programFilesPaths = new string[]
        {
            Environment.GetEnvironmentVariable("ProgramFiles"),
            Environment.GetEnvironmentVariable("ProgramFiles(x86)"),
            Environment.GetEnvironmentVariable("LOCALAPPDATA")
        };

        string chromePathSnippet = @"Google\Chrome\Application\";
        string edgePathSnippet = @"Microsoft\Edge\Application\";

        foreach (var path in programFilesPaths)
        {
            if (string.IsNullOrEmpty(path)) continue;
            string fullPath = "";
            if (browserExe == "chrome.exe") fullPath = Path.Combine(path, chromePathSnippet, browserExe);
            else if (browserExe == "msedge.exe") fullPath = Path.Combine(path, edgePathSnippet, browserExe);

            if (File.Exists(fullPath)) return fullPath;
        }
        return browserExe;
    }

    static void Main(string[] args)
    {
        string currentDir = AppDomain.CurrentDomain.BaseDirectory;
        string htmlPath = Path.Combine(currentDir, "index.html");
        
        // Critically important: URI Encode the path to handle spaces and Arabic characters in URL!
        string encodedPath = Uri.EscapeUriString(htmlPath.Replace("\\", "/"));
        string htmlUri = "file:///" + encodedPath;
        
        string arguments = string.Format("--app=\"{0}\" --window-size=1400,900", htmlUri);

        string chrome = FindBrowser("chrome.exe");
        try { Process.Start(chrome, arguments); return; } catch { }

        string edge = FindBrowser("msedge.exe");
        try { Process.Start(edge, arguments); return; } catch { }

        try { Process.Start(htmlPath); } catch (Exception ex) { MessageBox.Show("Failed: " + ex.Message); }
    }
}

