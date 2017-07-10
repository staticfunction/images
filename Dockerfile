FROM centos:7.2.1511

ARG project_name

ENV PROJECT_NAME ${project_name}

ENV PROJECT_WORKDIR /opt/${PROJECT_NAME}

RUN yum -y install epel-release

RUN yum install -y wget make

RUN ln -s -f /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

# Setup gosu for easier command execution
RUN gpg --keyserver pool.sks-keyservers.net --recv-keys B42F6819007F00F88E364FD4036A9C25BF357DD4 \
    && curl -o /usr/local/bin/gosu -SL "https://github.com/tianon/gosu/releases/download/1.2/gosu-amd64" \
    && curl -o /usr/local/bin/gosu.asc -SL "https://github.com/tianon/gosu/releases/download/1.2/gosu-amd64.asc" \
    && gpg --verify /usr/local/bin/gosu.asc \
    && rm /usr/local/bin/gosu.asc \
    && rm -r /root/.gnupg/ \
    && chmod +x /usr/local/bin/gosu

RUN curl -sL https://rpm.nodesource.com/setup_4.x | bash -
RUN yum install -y nodejs make gcc gcc-c++

RUN npm install -g node-gyp

RUN echo ${PROJECT_NAME}
RUN echo ${PROJECT_WORKDIR}

# Create app directory
RUN mkdir -p ${PROJECT_WORKDIR}
WORKDIR ${PROJECT_WORKDIR}


# Bundle app source
COPY dist ${PROJECT_WORKDIR}

# Install node modules
RUN if [ -f package.json ]; then npm install; fi

RUN yum remove -y make gcc gcc-c++

EXPOSE 3000

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Entrypoint script will call "npm run start"
ENTRYPOINT ["/entrypoint.sh"]
CMD ["npm"]
