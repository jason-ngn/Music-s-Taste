@ECHO OFF
ECHO ========== 
ECHO STARTING LAVALINK
ECHO ==========
start cmd /k java -jar Lavalink.jar
ECHO ==========
@ECHO TAKING A 5 SECOND BREAK FOR LAVALINK
ECHO ==========
timeout /T 5 /nobreak
ECHO ==========
@ECHO STARTING BOT
ECHO ==========
start cmd /k nodemon index.js
exit /s
