# Docker

## docker 中使用 mysql

1. 拉取镜像
```bash
docker pull mysql
```

2. 创建容器
```bash
docker container run -itd --name mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=123456 mysql
```

3. 复制配置文件（可选）
```bash
docker cp ./naars.sql b1fbd4ad011a:/tmp
```

3. 进入容器
```bash
# 指定环境变量 env LANG=C.UTF-8
# 或 echo "export LANG=C.UTF-8" >>/etc/profile && source /etc/profile（似乎不行）
docker container exec -it mysql env LANG=C.UTF-8 /bin/bash
```

4. 修改配置
```bash
mysql -uroot -p123456
# 远程连接授权
GRANT ALL ON *.* TO 'root'@'%';
# 刷新权限
flush privileges
```

5. 更改加密规则
```bash
# Navicat 只支持旧版本的加密, 需要更改 mysql 的加密规则
ALTER USER 'root'@'localhost' IDENTIFIED BY 'password' PASSWORD EXPIRE NEVER;
# 更新 root 用户密码
ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY '123456';
# 刷新权限
flush privileges;
```

docker 的 hub 中的 mysql 5.7 官方镜像可以直接运行，但是数据库文件及错误日志默认是存放在 docker image 中的，删除 container 后，数据库中的数据将丢失。使用如下命令行可以完美解决该问题：
```bash
docker container run -p 3306:3306 \
	--name mysql \
	--restart=always \
	-v /root/mysql/data:/var/lib/mysql \
	-e MYSQL_ROOT_PASSWORD=123456 -d mysql:5.7 \
	--log-error=/var/lib/mysql/error.log \
	--log-error-verbosity=2
```

说明：
- `-p 3306:3306`：把 container 的 3306 端口映射到宿主机的 3306 端口
- `---name mysql`：指定 container 名称
- `--restart=always`：重启机器后自动启动容器
- `-v /root/mysql/data:/var/lib/mysql`：将宿主机的 /root/mysql/data 目录映射到容器的 /var/lib/mysql 目录，后者正是存储数据库文件的位置
- `-e MYSQL_ROOT_PASSWORD=123456`：设置数据库的 root 密码
- `-d`：后台运行
- `--log-error=/var/lib/mysql/error.log`：设置错误日志文件，同数据库在同一个位置
- `--log-error-verbosity`：设置错误日志的等级，只记录错误信息及警告信息


## docker 中使用 postgres

1. 拉取镜像
```bash
docker pull postgres
```

2. 创建容器
```bash
docker run -itd --name postgres -e POSTGRES_PASSWORD='123456' -p 5432:5432 -d postgres
```

3. 进入容器
```bash
docker exec -it postgres bash
```

4. 登录
```bash
# 将当前 root 切换成 postgres
su postgres
# 登录
psql -U postgres -W
```
