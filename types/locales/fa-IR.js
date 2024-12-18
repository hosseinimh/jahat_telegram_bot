const messages = {
  start: `سلام. من TeamTune هستم و اینجام تا کمک کنم در تیم‌تون روابط افراد رو قدم به قدم، با تحلیل و بررسی، تنظیم کنی.🌱

📍البته تنظیم رابطه کار من نیست، این شما هستی که با دقت در حال و احوال خودت و هم‌تیمی‌هات متوجه میشی که در دنیای خودت و بقیه اعضای تیم چی می‌گذره ... با این تحلیل‌ها کم‌کم می‌تونی متوجه بشی که با چه کسی و در چه زمانی چه گفتگوهایی داشته باشی تا به تدریج رابطه‌های تیمی‌تون تنظیم‌تر بشه و تبدیل بشید به یک تیم زنده، پویا و کارآمد!

من همیشه برای انجام دو تا کار کنارت هستم:

 1️⃣ دکمه Read your Team رو که بزنی بهت می‌گم که وضعیت ارتباطی تیمت چطوره و می‌تونی از جنبه‌های مختلف ببینی اوضاع چطوره!
2️⃣ دکمه Tune your Team رو که بزنی با هم یک گپ کوتاه می‌زنیم و بر اساس تحلیلت از اوضاع ارتباطی تیم به یک سری راهکار و اقدام ارتباطی می‌رسیم که شما زحمت می‌کشی در تیمت انجام میدی و نتیجه‌ش رو دوباره در تحلیل‌های جدید می‌بینیم. به همین صورت قدم‌به‌قدم با هم جلو می‌ریم.

📌یک نکته خیلی مهم: تیم شما متشکل از یک سری انسان با پیچیدگی‌های مختلف هست. برای اینکه مطمئن باشیم روابط همه‌جانبه و معنادار می‌سازید، پیشنهاداتی که در بخش Tune your Team بهش می‌رسیم رو می‌تونی با تسهیل‌گران خبره‌ای که سال‌ها تجربه تسهیل‌گری در تیم‌های مختلف داشتند، چک کنی و مطمئن باشی بهترین اقدام ممکن رو برای تنظیم روابط تیمت انجام میدی!

براتون یک تیم یکپارچه، گرم و منسجم آرزو می‌کنم 🔥`,
  botNotAdded:
    "شما هنوز بات رو به هیچ گروهی اضافه نکردین. لطفا اول بات را به گروه خودتون اضافه کنین.",
  selectGroup: "لطفا گروه مورد نظرتون رو انتخاب کنین.",
  selectReadOrTune: `:field

لطفا یکی از گزینه‌های زیر رو انتخاب کنین:`,
  groupChatNotAvailable:
    "امکان چت با بات در گروه وجود نداره. لطفا مستقیما با بات ارتباط برقرار کنین.",
  groupNotFound:
    "گروه مورد نظرتون یافت نشد. لطفا گروه مورد نظرتون رو انتخاب کنین.",
  read: `برای خوندن آخرین وضعیت ارتباطی تیمت، این لینک رو باز کن:

:field

لطفا گزارش رو با دقت بخون، چون بعدش باید با هم در موردش صحبت کنیم.
`,
  tune: `گزارش TeamTune در مورد آخرین وضعیت ارتباطی تیمت رو خوندی؟ اگر نخوندی اول از طریق دکمه «Read your Team» حال و احوال ارتباطی تیمت رو بخون ...

اگر خوندی حالا وقته تحلیله و اقدام🏃‍♂️🏃‍♀️... 

برای اینکه بهت کمک کنم به یک سری ایده برای Tune کردن تیمت برسی، قبلش لازمه یه مقدار از ذهنیت‌ها و دغدغه‌هات به من بگی. مثلا می‌تونی به این سئوال‌ها فکر کنی و کوتاه بنویسی:
🖌با خوندن گزارش، تحلیل خودت از وضعیت ارتباطی تیمت چیه؟ 
🖌چه چیزی نگرانت کرد؟ چه چیزی خوشحال یا امیدوارت کرد؟
🖌به نظر خودت مهم‌ترین مشکل ارتباطی که باید حلش کنی چیه؟
🖌فکر می‌کنی چه کار میشه انجام داد و به نظرت آماده‌ی صحبت با چه کسانی هستی؟
🖌به غیر از این سئوالا هر دغدغه دیگه‌ای که همین الان در مورد تیمت داری برام بنویس ...`,
  reportsNotFoundIn1DayPeriod: "گزارشی در بازه زمانی دیروز یافت نشد.",
  reportsNotFoundIn30DayPeriod: "گزارشی در بازه زمانی 30 روز گذشته یافت نشد.",
  reportsCreatingError: "متاسفانه تولید گزارش با خطا مواجه شد.",
  messagesNotFoundIn1DayPeriod: "پیامی در گروه در بازه زمانی دیروز یافت نشد.",
  messagesNotFoundIn30DayPeriod:
    "پیامی در گروه در بازه زمانی 30 روز گذشته یافت نشد.",
  readBeforeTune:
    "گزارشی در بازه زمانی دیروز یافت نشد. برای مشاهده نتایج بهتر، اول دکمه «Read your Team» رو بزن تا گزارش ساخته بشه.",
  loading: "لطفا منتظر بمانید ...",
  groupIdNotFound: "گروه مورد نظرتون یافت نشد.",
  contactFacilitator: "تماس با تسهیل‌گر",
  contactFacilitatorText: `با توجه به توضیحاتت یک سری پیشنهاد دارم که در پیام بالا می‌تونی ببینی.
  وقشته که ‌ شروع کنی به انجام این اقدامات و اثرش رو در نحوه تعامل تیم و پیام‌هایی که بین افراد رد و بدل میشه ببینی. دوباره با تحلیل پیام‌های جدید و حال و احوال تیم، قدم‌های بعدی رو با هم بر می‌داریم.

  📍پیشنهاد می‌کنم برای اطمینان از کاری که می‌خواهی انجام بدی، نظر تسهیل‌گر TeamTune رو بگیری.
  موفق باشی ...`,
};

const buttons = {
  readYourTeam: "Read your Team",
  tuneYourTeam: "Tune your Team",
};

module.exports = { messages, buttons };
