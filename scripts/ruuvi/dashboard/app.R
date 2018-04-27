library(RMySQL)
library(jsonlite)

con = dbConnect(MySQL(),
  dbname = "mikko",
  host = "127.0.0.1", 
  port = 3306, 
  user = "mikko", 
  password = "")

myQuery <- "SELECT * FROM RuuviTag"
df <- dbGetQuery(con, myQuery)

names(df)
class(df)
N <- nrow(df)

df2 <- data.frame(timestamp=rep("", N), deviceId=rep("", N), temperature=rep("", N), pressure=rep("", N), humidity=rep("", N),  # as many cols as you need
                 stringsAsFactors=FALSE) 

json_data <- df[,c("data")]
json_data
for (i in 1:N) {
  timestamp <- df$timestamp[i]
  deviceId <- df$deviceId[i]
  temperature <- fromJSON(json_data[i])$temperature
  pressure <- fromJSON(json_data[i])$pressure
  humidity <- fromJSON(json_data[i])$humidity
  print(temperature)
  print(pressure)
  print(humidity)
  if(is.null(temperature)){
    temperature <- ""
  }
  if(is.null(pressure)){
    pressure <- ""
  }
  if(is.null(humidity)){
    humidity <- ""
  }
  df2[i, ] <- list(timestamp, deviceId, temperature, pressure, humidity)
}

dbDisconnect(con)
