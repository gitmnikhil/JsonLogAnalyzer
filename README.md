# JsonLogAnalyzer

It Help in analyzing heavy log files present in local LAN environment. 
Pre-Requisite 
1. Input - Folder location on LAN. As uploading heavy files(in my case it was ~3GB) will consume lots of time and bandwidth.
For example - E:/logs
2. The folder should only contain log files as every file and folder present in this folder will be processed.
3. The log file should contain logs in json formatted shape. One line should contain one Log in JSON format.
For use -
1. Clone the Repository
2. Do npm install.
3. Run mongodb and start the server.
4. Navigate to http://localhost:3000/
5. Provide the path of the folder where logs are present. For example - E:/logs
6. Add the required filter and filter the results.
7. If user need to do a contains check then add the regex Expression as .``*Text.``* and select the Is Regex checkbox.
