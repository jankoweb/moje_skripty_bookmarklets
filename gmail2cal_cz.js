/* Script for bookmarklet - select text in gmail that contains date and time and create calendar event in czech format.
author: JanKo, jankoweb(at)volny.cz
*/
url = window.location;
if (window.getSelection){ selection = window.getSelection(); } else if (document.getSelection) { selection = document.getSelection(); } else if (document.selection) { selection = document.selection.createRange().text; }
/* I don't know why, but without + '' it does not work */
selection = selection + '';
str = selection;
/*
str = 'fasdfa 15. 4  sd fasd 18 h http://mecp.cu/fas fasdf  20. července 19h adfa fa fadsfasd f 15.5. a fa fasdf';
*/
/* corrects time */
str = str.replace(/([0-9]{1,2}) ?h/g,'$1:00'); /*18 h -> 18:00*/
/* corrects date */
str = str.replace(/([0-9]{1,2})\. ?([0-9]{1,2})/g,'$1.$2.'); /* 13.5., 13. 5., 13.5 */
/* corrects czech months */
str = str.replace(/([0-9]{1,2})\. ?led[^ ]*/g,'$1.01.'); /* 13. ledna */
str = str.replace(/([0-9]{1,2})\. ?úno/g,'$1.02.');
str = str.replace(/([0-9]{1,2})\. ?bře/g,'$1.03.');
str = str.replace(/([0-9]{1,2})\. ?dub/g,'$1.04.');
str = str.replace(/([0-9]{1,2})\. ?kvě/g,'$1.05.');
str = str.replace(/([0-9]{1,2})\. ?červen[^ ]*/g,'$1.07.'); /* musi byt pred cervnem, jinak by se nahradilo spatne */
str = str.replace(/([0-9]{1,2})\. ?čer/g,'$1.06.');
str = str.replace(/([0-9]{1,2})\. ?srp/g,'$1.08.');
str = str.replace(/([0-9]{1,2})\. ?zář/g,'$1.09.');
str = str.replace(/([0-9]{1,2})\. ?říj/g,'$1.10.');
str = str.replace(/([0-9]{1,2})\. ?lis/g,'$1.11.');
str = str.replace(/([0-9]{1,2})\. ?pro/g,'$1.12.');
 
/* parsing */
date = str.match(/([0-9]{1,2})\.([0-9]{1,2})\./g); /* 5.6.*/
time = str.match(/[0-9]{1,2}:[0-9]{2}/g); /*18:00*/
 
map = str.match(/http:\/\/[^ ]+/g);
if (map == null)
map = '';
/* initialize */
today = new Date();
time_from = ('0' + today.getHours()).slice(-2) + ('0' + today.getMinutes()).slice(-2);
date_from = ('0' + (today.getMonth()+1)).slice(-2) + ('0' + today.getDate()).slice(-2);
time_to = time_from;
date_to = date_from;
year = today.getFullYear();
/* parse time */
if (time != null)
{
if (time.length >= 2)
{ // we found two times
tmp = time[0].split(':');
if (tmp[0].length==1)
tmp[0] = '0' + tmp[0];
if (tmp[0].length==1)
tmp[1] = '0' + tmp[1];
time_from = tmp[0]+tmp[1];
tmp = time[1].split(':');
if (tmp[0].length==1)
tmp[0] = '0' + tmp[0];
if (tmp[1].length==1)
tmp[1] = '0' + tmp[1];
time_to = tmp[0]+tmp[1];
}
else
{
tmp = time[0].split(':');
if (tmp[0].length==1)
tmp[0] = '0' + tmp[0];
if (tmp[1].length==1)
tmp[1] = '0' + tmp[1];
time_from = tmp[0]+tmp[1];
time_to = time_from;
}
} /* end of parse time */
 
if (date != null)
{
if (date.length >= 2)
{ /* we found two dates */
tmp = date[0].split('.');
if (tmp[0].length==1)
tmp[0] = '0' + tmp[0];
if (tmp[1].length==1)
tmp[1] = '0' + tmp[1];
date_from = tmp[1]+tmp[0];
tmp = date[1].split('.');
if (tmp[0].length==1)
tmp[0] = '0' + tmp[0];
if (tmp[1].length==1)
tmp[1] = '0' + tmp[1];
date_to = tmp[1]+tmp[0];
}
else
{
tmp = date[0].split('.');
if (tmp[0].length==1)
tmp[0] = '0' + tmp[0];
if (tmp[1].length==1)
tmp[1] = '0' + tmp[1];
date_from = tmp[1]+tmp[0];
date_to = date_from;
}
} /* end of parse time */
if (selection.length>25)
{
text = selection.substring(0,24);
}
else
{
text = selection;
}
/* ladeni */
/*selection = selection + '\n\n' + str;*/
 
from = year + date_from + 'T' + time_from + '00';
to = year + date_to + 'T' + time_to + '00';
calendar = '';
urlopen = 'https://www.google.com/calendar/render?action=TEMPLATE&dates='+from+'/'+to+'&text='+text+'&location='+map+'&details='+encodeURIComponent(selection+'\n\nmail link\n'+url)+'&src='+calendar;
/*alert(urlopen);*/
void(window.open(urlopen));
