---
title: "PHPMailer6.0.7如何在类中被调用"
description: "在写发送邮件时发现移植过来的PHPMailer是旧版的（是没有namespace）的，在后面的版本官方才更新过来，于是我在github下载到最新的版本准备写一个发送邮件"
date: 2019-09-19 12:34:09
categories: ["后端"]
tags: ["PHP"]
---

# PHPMailer6.0.7如何在类中被调用

::: tip 背景
在写发送邮件时发现移植过来的PHPMailer是旧版的（是没有namespace）的，在后面的版本官方才更新过来，于是我在github下载到最新的版本准备写一个发送邮件
:::

## 第一步

当然是下载 `PHPMailer` 地址：[https://github.com/PHPMailer/PHPMailer](https://github.com/PHPMailer/PHPMailer)

## 第二步

将文件引入项目中，只保留 `src` 目录，其余的不用留

## 第三步

新建一个文件，文件名为 `sendMail.php` ，写如下代码进行配置

```php
<?php
namespace dncTool;

use PHPMailerPHPMailerPHPMailer;
use PHPMailerPHPMailerException;

//引入项目

$dir = dirname(__FILE__) . '/PHPMailer';
require ($dir . '/src/Exception.php');
require ($dir . '/src/PHPMailer.php');
require ($dir . '/src/SMTP.php');

class sendMail
{
    public static $Host = 'smtp.163.com'; //smtp服务器
    private static $From = '这里写邮件地址'; //发送者的邮件地址
    private static $FromName = '签到助手'; //发送邮件的用户昵称
    private static $Username = '这里写邮件地址'; //登录到邮箱的用户名
    private static $Password = '授权码'; //第三方登录的授权码，在邮箱里面设置

    /**
     * 发送
     * @param $sendMail
     * @param $mailTitle
     * @param $content
     * @return bool
     */
    public function send($sendMail,$mailTitle,$content)
    {
        //实例化PHPMail类
        $mail = new PHPMailer(true);
        try {
            //Server settings
            $mail->SMTPDebug = 0; // 关闭Dubug模式
            $mail->isSMTP(); // 使用SMTP发送邮件
            $mail->Host = self::$Host; //SMTP邮件服务器地址（腾讯企业邮为例）
            $mail->SMTPAuth = true; //发信认证
            $mail->Username = self::$Username; // SMTP 发件人邮箱
            $mail->Password = self::$Password; // SMTP 发件人邮箱密码
            $mail->SMTPSecure = 'ssl'; //ssl协议
            $mail->Port = 465; //ssl端口号

            //发件人
            $mail->setFrom(self::$From, self::$FromName); //发件人邮箱（同 $mail->Username项设置）、发件人名称

            //收件人。多收件人可设置多个addAddress
            $mail->addAddress($sendMail, ''); //收件人邮箱地址，收件人姓名（选填）
            //$mail->addAddress('ellen@example.com'); // 收件人邮箱地址

            //邮件内容
            $mail->isHTML(true); //发送html格式邮件
            $mail->Subject = $mailTitle; //邮件标题
            $mail->Body    = $content; //邮件内容
            $mail->AltBody = '邮件摘要'; //目测没什么用，可去掉

            //判断是否发送成功
            if ($mail->send()) {
                return true;
            } else {
                return false;
            }
        } catch (Exception $e) {
            return $mail->ErrorInfo;
        }
    }
}
```

## 第四步

在另一个地方实例化这个类就行，然后就可以进行参数传递，代码如下：

```php
$mailSend = new dncToolsendMail();

//设置要发送的邮箱
$sendMail=$email;

//邮件标题
$mailTitle = "您收到签到助手的一条邮件";

//$content为邮件内容
$newPwd = $this->makeCardPassword();
$content="<div><b>您的新密码为：" . $newPwd . ",请尽快登陆并修改密码</b></div>";

//执行发信
$sendRes = $mailSend->send($sendMail,$mailTitle,$content);
if ($sendRes == false) {
	exit(jsonCode('error','服务错误，请重新尝试'));
} else {
	exit(jsonCode('ok','已将重置后的密码发送到您的邮箱中！'));
}
```

## 成功发信

![mark](https://pic.yqqy.top/blog/20200111/8TGarEu0hX9E.png "收到邮件")

![mark](https://pic.yqqy.top/blog/20200111/024PtSRickMk.png "发送邮件")