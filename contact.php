<?php
$field_name = $_POST['cf_name'];
$field_email = $_POST['cf_email'];
$field_phone = $_POST['cf_phone'];
$field_message = $_POST['cf_message'];

$mail_to = 'licari.multimedios@gmail.com';
$subject = 'Tenes un mensaje de '.$field_name;

$body_message = 'De: '.$field_name."\n";
$body_message .= 'E-mail: '.$field_email."\n";
$body_message .= 'Tel: '.$field_phone."\n";
$body_message .= 'Mensaje: '.$field_message;

$headers = 'De: '.$field_email."\r\n";
$headers .= 'Reply-To: '.$field_email."\r\n";

$mail_status = mail($mail_to, $subject, $body_message, $headers);

if ($mail_status) { ?>
	<script language="javascript" type="text/javascript">
		alert('Gracias por tu mensaje. En breve te escribo.');
		window.location = 'index.html';
	</script>
<?php
}
else { ?>
	<script language="javascript" type="text/javascript">
		alert('Error! Revisa todos los campos y volvé a intentar');
		window.location = 'index.html';
	</script>
<?php
}
?>