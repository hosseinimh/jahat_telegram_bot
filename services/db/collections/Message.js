const { connectToCluster } = require("../DbService");

const COLLECTION_NAME = "messages";

async function handleCountTags(query) {
  let mongoClient;
  let count = 0;

  try {
    mongoClient = await connectToCluster(process.env.DB_URI);
    const db = mongoClient.db(process.env.DB);
    const collection = db.collection(COLLECTION_NAME);
    count = await collection.countDocuments(query);
  } catch (e) {
    console.error("error", e);
  } finally {
    await mongoClient.close();

    return count;
  }
}

async function countSearleTags(groupId, begin, end) {
  try {
    const tags = [
      "کنش اظهاری",
      "کنش عاطفی",
      "کنش ترغیبی",
      "کنش دستوری",
      "کنش تعهدی",
    ];
    let count = tags.map(async (tag) => {
      const count = await handleCountTags({
        "chat.id": parseInt(groupId),
        "chat.type": "group",
        date: { $gte: begin, $lte: end },
        "tags.searleTags": { $in: [tag] },
      });

      return { tag, count };
    });

    return await Promise.all(count);
  } catch (e) {
    console.error("error", e);

    return null;
  }
}

async function countIllocutionaryTags(groupId, begin, end) {
  try {
    const tags = [
      "اعتراض",
      "نشست",
      "سیاست‌گذاری",
      "سپاس‌گذاری",
      "تعریف",
      "تبریک",
      "تهدیدی",
      "درخواست",
      "احترام",
      "شکایت",
      "امیدواری و آرزومندی",
      "مشارکت در بهبود",
      "پاسخگویی",
      "تشویق",
      "تحسین",
      "پیشنهاد",
      "قدردانی",
      "اطلاع‌رسانی",
      "حمایت",
      "دفاع",
      "موافقت",
      "سوال",
      "شوخی طبعی",
      "حس قربانی شدن",
      "شوخی",
    ];

    let count = tags.map(async (tag) => {
      const count = await handleCountTags({
        "chat.id": parseInt(groupId),
        "chat.type": "group",
        date: { $gte: begin, $lte: end },
        "tags.austinTags.illocutionary": { $in: [tag] },
      });

      return { tag, count };
    });

    return await Promise.all(count);
  } catch (e) {
    console.error("error", e);

    return null;
  }
}

async function countLocutionaryTags(groupId, begin, end) {
  try {
    const tags = [
      "قدردانی",
      "بیان مسئله",
      "اشتراک تجربه/گفتگو/احساس",
      "نشست",
      "امیدواری و آرزومندی",
      "درخواست",
      "تبریک",
      "جذب توجه به موضوع",
      "پاسخگویی",
      "اطلاع‌رسانی",
      "تحسین",
      "تشویق",
      "ارائه تصویر کلی‌تر",
      "موافقت",
      "پیشنهاد",
      "پرسش",
      "اعتراض",
      "اقدام",
      "شوخی طبعی",
      "راهنمایی",
      "احترام",
      "اشتراک‌گذاری",
      "شکایت",
    ];

    let count = tags.map(async (tag) => {
      const count = await handleCountTags({
        "chat.id": parseInt(groupId),
        "chat.type": "group",
        date: { $gte: begin, $lte: end },
        "tags.austinTags.locutionary": { $in: [tag] },
      });

      return { tag, count };
    });

    return await Promise.all(count);
  } catch (e) {
    console.error("error", e);

    return null;
  }
}

async function countExpressionTags(groupId, begin, end) {
  try {
    const tags = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    let count = tags.map(async (tag) => {
      const count = await handleCountTags({
        "chat.id": parseInt(groupId),
        "chat.type": "group",
        date: { $gte: begin, $lte: end },
        "tags.expressionTags": { $in: [tag] },
      });

      return { tag, count };
    });

    return await Promise.all(count);
  } catch (e) {
    console.error("error", e);

    return null;
  }
}

async function countSentimentTags(groupId, begin, end) {
  try {
    const tags = ["مثبت", "منفی", "خنثی"];

    let count = tags.map(async (tag) => {
      const count = await handleCountTags({
        "chat.id": parseInt(groupId),
        "chat.type": "group",
        date: { $gte: begin, $lte: end },
        "tags.sentimentTags": { $in: [tag] },
      });

      return { tag, count };
    });

    return await Promise.all(count);
  } catch (e) {
    console.error("error", e);

    return null;
  }
}

async function countDistributionTags(groupId, begin, end) {
  try {
    const tags = [
      "توسعه محصول",
      "پشتیبانی مشتریان",
      "هماهنگی تیمی",
      "حقوق و مزایا",
      "مسائل رفاهی",
      "مرخصی و غیبت",
      "استخدام نیرو",
      "آموزش و توسعه",
      "ارتقاء شغلی",
      "اعتراض مشتریان",
      "قیمت‌گذاری",
      "مدیریت پروژه",
      "درخواست کمک",
      "تهیه مستندات",
      "حل مشکلات تیمی",
      "اشتراک دانش",
      "نوآوری و خلاقیت",
      "فروش و بازاریابی",
      "کنترل کیفیت",
      "تحقیق و توسعه",
      "پشتیبانی فنی",
      "امور مالی",
      "قراردادها و توافقات",
      "مدیریت ریسک",
      "ایمنی و بهداشت",
      "مشاوره و پیشنهادات",
      "مدیریت منابع انسانی",
      "حضور و غیاب",
      "کنترل بودجه",
      "اطلاع‌رسانی داخلی",
      "تعامل با تامین‌کنندگان",
      "روابط عمومی",
      "بازخورد کارکنان",
      "مسائل حقوقی",
      "مدیریت مشتریان",
      "برنامه‌های تشویقی",
      "برنامه‌ریزی استراتژیک",
      "خدمات پس از فروش",
      "ارتباطات بین‌المللی",
      "مسائل امنیتی",
      "برنامه‌های فرهنگی",
      "تحلیل داده‌ها",
      "مدیریت زمان",
      "توسعه فردی",
      "مدیریت فناوری اطلاعات",
      "برگزاری جلسات",
      "تعارضات تیمی",
      "انتقادات کارکنان",
      "فرهنگ سازمانی",
    ];

    let count = tags.map(async (tag) => {
      const count = await handleCountTags({
        "chat.id": parseInt(groupId),
        "chat.type": "group",
        date: { $gte: begin, $lte: end },
        "tags.distributionTags": { $in: [tag] },
      });

      return { tag, count };
    });

    return await Promise.all(count);
  } catch (e) {
    console.error("error", e);

    return null;
  }
}

async function insertMessage(message) {
  let mongoClient;

  try {
    mongoClient = await connectToCluster(process.env.DB_URI);
    const db = mongoClient.db(process.env.DB);
    const collection = db.collection(COLLECTION_NAME);

    await collection.insertOne(message);
  } catch (e) {
    console.error(e);
  } finally {
    await mongoClient.close();
  }
}

async function countTags(groupId, begin, end) {
  try {
    const searleTags = await countSearleTags(groupId, begin, end);
    const illocutionaryTags = await countIllocutionaryTags(groupId, begin, end);
    const locutionaryTags = await countLocutionaryTags(groupId, begin, end);
    const expressionTags = await countExpressionTags(groupId, begin, end);
    const sentimentTags = await countSentimentTags(groupId, begin, end);
    const distributionTags = await countDistributionTags(groupId, begin, end);

    return {
      countSearleTags: searleTags,
      countIllocutionaryTags: illocutionaryTags,
      countLocutionaryTags: locutionaryTags,
      countExpressionTags: expressionTags,
      countSentimentTags: sentimentTags,
      countDistributionTags: distributionTags,
    };
  } catch {
    return null;
  }
}

async function findMessages(query) {
  let mongoClient;
  let messages = null;

  try {
    mongoClient = await connectToCluster(process.env.DB_URI);
    const db = mongoClient.db(process.env.DB);
    const collection = db.collection(COLLECTION_NAME);

    messages = collection.find(query);
    messages = await messages.toArray();
  } catch (e) {
    messages = null;
    console.error(e);
  } finally {
    await mongoClient.close();

    return messages;
  }
}

const messagesCollection = {
  insertMessage,
  countTags,
  findMessages,
};

module.exports = messagesCollection;
