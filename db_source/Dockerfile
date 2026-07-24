FROM mysql:8.4 AS builder

ENV MYSQL_DATABASE=morphalou
ENV MYSQL_ROOT_PASSWORD=root
ENV MYSQL_ROOT_HOST=%

COPY ./01-lemma.sql /docker-entrypoint-initdb.d/
COPY ./02-inflection.sql /docker-entrypoint-initdb.d/

# Run entrypoint init once during build, then shut down
RUN docker-entrypoint.sh mysqld --datadir=/initialized-db & \
    pid=$! && \
    until mysqladmin ping -h 127.0.0.1 -uroot -proot --silent; do sleep 2; done && \
    mysql -h 127.0.0.1 -uroot -proot -e "SELECT COUNT(*) FROM morphalou.lemma" && \
    mysqladmin -h 127.0.0.1 -uroot -proot shutdown && \
    wait "$pid" || true

FROM mysql:8.4
ENV MYSQL_DATABASE=morphalou
ENV MYSQL_ROOT_PASSWORD=root

# COPY defaults to root:root. Without --chown, the entrypoint's
# `find … ! -user mysql -exec chown` walks the whole Morphalou datadir on
# every start (~20–30s on overlayfs).
COPY --from=builder --chown=mysql:mysql /initialized-db /var/lib/mysql