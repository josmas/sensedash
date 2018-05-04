library("shiny")
library("shinydashboard")
library(ggplot2)
library(RMySQL)
library(jsonlite)
library(anytime)

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

df2 <- data.frame(timestamp=rep(0, N), deviceId=rep("", N), temperature=rep(0, N), pressure=rep(0, N), humidity=rep(0, N),  # as many cols as you need
                  stringsAsFactors=FALSE) 

json_data <- df[,c("data")]
json_data
for (i in 1:N) {
  timestamp <- anytime(strtoi(df$timestamp[i]))
  deviceId <- df$deviceId[i]
  temperature <- fromJSON(json_data[i])$temperature
  pressure <- fromJSON(json_data[i])$pressure
  humidity <- fromJSON(json_data[i])$humidity
  #print(timestamp)
  #print(temperature)
  #print(pressure)
  #print(humidity)
  if(is.null(timestamp)){
    timestamp <- ""
  }
  if(is.null(temperature)){
    temperature <- ""
  }
  if(is.null(pressure)){
    pressure <- ""
  }
  if(is.null(humidity)){
    humidity <- ""
  }
  df2[i, ] <- list(anytime(timestamp), deviceId, temperature, pressure, humidity)
}

dbDisconnect(con)
sapply(df2, typeof)
df2[,"timestamp"] = anytime(df2[,"timestamp"])
last_day_time <- Sys.time() - as.difftime(24, unit="hours")
last_month_time <- Sys.time() - as.difftime(30, unit="days")
last_day <- subset(df2, timestamp > last_day_time )
last_month <- subset(df2, timestamp > last_day_time )

sidebar <- dashboardSidebar(
  sidebarMenu(
    # Create two `menuItem()`s, "Dashboard" and "Inputs"
    menuItem(text = "Humidity",
             tabName = "humidity"
    ), 
    menuItem(text = "Temperature", 
             tabName = "temperature"

    ),
    menuItem(text = "Pressure", 
             tabName = "pressure"
             )
  )
)
header <- dashboardHeader()
body <- dashboardBody(
  
  # Outputs
  mainPanel(
    plotOutput(outputId = "humidity"),
    plotOutput(outputId = "temperature"),
    plotOutput(outputId = "pressure")
  )
  
)

# Create the UI using the header, sidebar, and body
ui <- dashboardPage(header = header,
                    sidebar = sidebar,
                    body = body)

server <- function(input, output) {
  
  # Create the scatterplot object the plotOutput function is expecting
  output$humidity <- renderPlot({
    
    ggplot(data = df2, aes_string(x = "timestamp", y = "humidity")) +
      geom_point() + theme(axis.text.x = element_text(angle = 90, hjust = 1))
  })
  
  output$temperature <- renderPlot({
    
    ggplot(data = df2, aes_string(x = "timestamp", y = "temperature")) +
      geom_point() + theme(axis.text.x = element_text(angle = 90, hjust = 1))
  })
  
  output$pressure <- renderPlot({
    
    ggplot(data = df2, aes_string(x = "timestamp", y = "pressure")) +
      geom_point() + theme(axis.text.x = element_text(angle = 90, hjust = 1))
  })
}

shinyApp(ui, server)
