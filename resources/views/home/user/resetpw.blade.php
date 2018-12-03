<?php  include PATH_TPL.'/tpl.header.phtml'?>
<div class="content clear">
	<div class="center">
		<div class="wrap">
			<div class="box">
				<div class="TitleBox">
					<h3 class="PlateTitle"><span>忘记密码</span><b>还没有账号？现在就</b><a class="PlateTitleA1" href="/user/reg">免费注册</a></h3>
				</div>
				<div class="loginBox">
					<form method="post">
					<div class="login">
						<div class="clear">
							<span>邮箱：</span><input type="text" class="loginValue" id="email" name="email" value="<?php if(isset($emailmsg))echo $_POST['email']?>">
							<?php  if(isset($emailmsg)) echo '<b class="false">', $emailmsg, '</b>';?>
						</div>
					</div>
					<div class="login">
						<div class="clear">
							<span>验证码：</span><input class="loginValue" name="captcha" id="captcha">
							<?php  if(isset($captchamsg)) echo '<b class="false">', $captchamsg, '</b>';?>
						</div>
					</div>
					<div class="login">
						<div class="clear">
							<span></span>
							<img id="captchaimg" src="/index/captcha?t=<?php  echo rand(100000, 999999)?>"> <a href="#" onclick="$('#captchaimg').attr('src', '/index/captcha?t='+Math.random())">看不清，再换一张</a>
						</div>
					</div>
					<div class="loginBtn clear">
						<input type="submit" value="找回密码" class="loginButton">
						<a class="PlateTitleA1" href="/user/reg">免费注册</a>
					</div>
					</form>
				</div>
			</div>
		</div>
	</div>
</div>
<?php  include PATH_TPL.'/tpl.footer.phtml'?>