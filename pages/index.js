import MeetupList from "../components/meetups/MeetupList";
import { MongoClient } from "mongodb";
import Head from 'next/head';
import { Fragment } from "react";
function HomePage(props) {
  return (
    <Fragment>
      <Head>
        <title>React Meetups</title>
        <meta
          name='description'
        content='Browse a huge list of highly active React meetups!'/>
      </Head>
      <MeetupList meetups={props.meetups} />
    </Fragment>
  );
}

export async function getStaticProps() {

  //db연결
    const client = await MongoClient.connect(
      "mongodb+srv://Cluster0:hDe1PzJfhggomi7M@cluster0.ydtpokz.mongodb.net/?retryWrites=true&w=majority"
    );
    //데이터베이스 생성
    const db = client.db();

    //컬렉션의 이름 설정
  const meetupsCollection = db.collection("meetups");

  //기본적으로 핻당 컬렉션에 모든 문서를 찾는다.
  const meetups = await meetupsCollection.find().toArray();

  client.close();
  
  return {
    props: {
      meetups: meetups.map(meetup => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString()
      }))
    },
  };
}
export default HomePage;
