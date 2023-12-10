# 拷贝conf到本地
scp -r  root@110.42.244.233:/etc/nginx/nginx.conf ./
#拷贝conf到远程
scp -r nginx.conf root@110.42.244.233:/etc/nginx/
#拷贝项目到远程
scp -r dist.zip root@110.42.244.233:/etc/nginx/website/

#解压

sudo unzip dist.zip
sudo rm -rf dist.zip

ssh ubuntu@110.42.244.233
密码 XxW5xBfwpuVKMu1rYybe3grM