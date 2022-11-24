import { Fragment } from "react";
import { MongoClient, ObjectId } from 'mongodb';
import MeetupDetail from "../../components/meetups/MeetupDetail";
import Head from 'next/head';
function MeetupDetails(props) {
  return (
    <Fragment>
      <Head>
        <title>{props.meetupData.title}</title>
        <meta name='description' content={props.meetupData.description}/>
      </Head>
      <MeetupDetail
        image={props.meetupData.image}
        title={props.meetupData.title}
        address={props.meetupData.address}
        description={props.meetupData.description}
      />
    </Fragment>
  );
}

//동적 페이지가 프리 제너레이트 될 동적 컴포넌트의 ID를 적어주는 서버 사이드 함수
//fallback은 nextjs에게 paths 배열이 모든 지원되는 매개변수를 저장할지 아니면 일부만 저장할지 말해줍니다.
export async function getStaticPaths() {
  //db연결
  const client = await MongoClient.connect(
    "mongodb+srv://Cluster0:hDe1PzJfhggomi7M@cluster0.ydtpokz.mongodb.net/?retryWrites=true&w=majority"
  );
  //데이터베이스 생성
  const db = client.db();

    //컬렉션의 이름 설정
  const meetupsCollection = db.collection("meetups");

  //첫번째 객체로 모든 객체를 가져오고 모든 문서가 추출되어야 하는 필드를 정의하는 
  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray(); //ID는 포함하고 다른 필드 값은 포함하지 않는다
  
  client.close();

  return {
    //false가 모든 지원되는 미트업 ID 값을 포함하라는 것
    //true는 nextjs가 페이지를 동적으로 만들 것
    fallback: false,
    paths: meetups.map(meetup => ({ params: { meetupId: meetup._id.toString()}})),
  };
}

export async function getStaticProps(context) {
  const meetupId = context.params.meetupId; // ID 객체
  //대괄호 사이에 있는 것은 프로퍼티

  //db연결
  const client = await MongoClient.connect(
    "mongodb+srv://Cluster0:hDe1PzJfhggomi7M@cluster0.ydtpokz.mongodb.net/?retryWrites=true&w=majority"
  );
  //데이터베이스 생성
  const db = client.db();

    //컬렉션의 이름 설정
  const meetupsCollection = db.collection("meetups");

  //첫번째 객체로 모든 객체를 가져오고 모든 문서가 추출되어야 하는 필드를 정의하는 객체 전달
  const selectedMeetup = await meetupsCollection.findOne({
    _id: ObjectId(meetupId),//ObjectId 객체로 문자열을 전환합니다.
  });
  
  client.close();

  return {
    props: {
      meetupData: {
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.title,
        address: selectedMeetup.address,
        image: selectedMeetup.image,
        description: selectedMeetup.description,
      },
    },
  };
}
export default MeetupDetails;
