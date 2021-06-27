FROM centos:7

MAINTAINER Hina Rui XiXi

RUN yum install python3 -y


ADD HinaBlog /root/

WORKDIR /root/
RUN pip3 install -r requirements.txt
RUN pip3 install --upgrade pip
RUN pip3 install cryptography

EXPOSE 8080


CMD python3 manage.py runserver 0.0.0.0:8080