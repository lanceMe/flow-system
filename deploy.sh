
#密码 XxW5xBfwpuVKMu1rYybe3grM

# 拷贝conf到本地
#scp -r  root@110.42.244.233:/etc/nginx/nginx.conf ./
#拷贝conf到远程
#scp -r nginx.conf root@110.42.244.233:/etc/nginx/
#拷贝项目到远程
scp -r dist.zip root@110.42.244.233:/etc/nginx/website/
#登录到远程
ssh root@110.42.244.233

#进入website目录
cd /etc/nginx/website

#删除dist文件夹
rm -rf dist

#解压
unzip dist.zip
rm -rf dist.zip


#进入websiteDev目录
scp -r dist.zip root@110.42.244.233:/etc/nginx/websiteDev/
#登录到远程
ssh root@110.42.244.233
cd /etc/nginx/websiteDev
#删除dist文件夹
rm -rf dist

#解压
unzip dist.zip
rm -rf dist.zip

