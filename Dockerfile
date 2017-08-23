FROM tomcat:8-alpine
ADD target/utilycompany.oss-0.0.1-SNAPSHOT.war $CATALINA_HOME/webapps/oss.war
CMD ["catalina.sh", "run"]