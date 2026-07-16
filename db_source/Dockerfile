FROM mysql:latest

ENV MYSQL_DATABASE morphalou
ENV MYSQL_ROOT_PASSWORD root

# COPY ./lemma.sql /var/db_source/lemma.sql
# COPY ./inflection.sql /var/db_source/inflection.sql

COPY ./01-lemma.sql /docker-entrypoint-initdb.d/01-lemma.sql
COPY ./02-inflection.sql /docker-entrypoint-initdb.d/02-inflection.sql


# RUN mysql -u root -p${MYSQL_ROOT_PASSWORD} -h 127.0.0.1 --protocol=tcp ${MYSQL_DATABASE} < /var/db_source/lemma.sql

# RUN mysql -u root -p${MYSQL_ROOT_PASSWORD} -h 127.0.0.1 --protocol=tcp ${MYSQL_DATABASE} < /var/db_source/inflection.sql
