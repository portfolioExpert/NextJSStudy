import { MongoClient } from "mongodb";
// /api/new-meetup

async function handler(req, res) {
  if (req.method === "POST") {
    const data = req.body;

    //db연결
    const client = await MongoClient.connect(
      "mongodb+srv://Cluster0:hDe1PzJfhggomi7M@cluster0.ydtpokz.mongodb.net/?retryWrites=true&w=majority"
    );
    //데이터베이스 생성
    const db = client.db();

    //컬렉션의 이름 설정
    const meetupsCollection = db.collection("meetups");

    const result = await meetupsCollection.insertOne(data);

    console.log(result);

    client.close();

    res.status(201).json({ message: "Meetup inserted!" });
  }
}

export default handler;
