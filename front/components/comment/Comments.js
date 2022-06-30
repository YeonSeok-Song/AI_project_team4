import * as API from '../../pages/api/api';
import CommentCard from './CommentCard';
import CommentAddForm from './CommentAddForm';
import { useState, useEffect } from 'react';

function Comments({ roomId, writerId }) {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    // "comments/유저id"로 GET 요청하고, response의 data로 comments를 세팅함.

    API.get('comments', roomId).then((res) => setComments(res.data));
  }, [roomId]);
  console.log(comments, '확인하고싶음');

  return (
    <div>
      <div className="mr-5">
        <div>Comments</div>
        <CommentAddForm
          roomId={roomId}
          setComments={setComments}
          writerId={writerId}
        />
        {comments.map((comment, index) => (
          <CommentCard
            roomId={roomId}
            writerId={comment.writerId}
            key={index}
            comment={comment}
            setComments={setComments}
          />
        ))}
      </div>
    </div>
  );
}

export default Comments;
