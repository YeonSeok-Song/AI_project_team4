import is from '@sindresorhus/is';
import { Router } from 'express';
import { login_required } from '../middlewares/login_required';
import { commentsService } from '../services/commentsService';
import { userAuthService } from '../services/userService';
import dayjs from 'dayjs';

const commentsRouter = Router();

// 댓글 생성
commentsRouter.post('/comment', login_required, async function (req, res, next) {
    try {
        if (is.emptyObject(req.body)) {
            throw new Error('headers의 Content-Type을 application/json으로 설정해주세요');
        }
        const now = dayjs();
        const writerId = req.currentUserId;
        const { targetId, roomId, content } = req.body;
        let newComment = {
            writerId,
            roomId,
            content,
            createdAt: now.format('YYYY-MM-DD HH:mm:ss'),
            updatedAt: now.format('YYYY-MM-DD HH:mm:ss'),
        };

        if (targetId) {
            const user_id = targetId;
            const targetedId = await userAuthService.getUserInfo({ user_id });
            if (targetedId.errorMessage) throw new Error(targetedId.errorMessage);
            newComment.targetId = targetedId.id;
        }
        const Comment = await commentsService.create({ newComment });

        res.status(201).json(Comment);
    } catch (error) {
        next(error);
    }
});

// 댓글 수정
commentsRouter.put('/comment', login_required, async function (req, res, next) {
    try {
        const now = dayjs();
        const writerId = req.currentUserId;
        const { _id, content } = req.body;
        if (!_id || !content) {
            res.status(400).json('_id혹은 content가 넘어오지 않았습니다.');
            return;
        }

        const writerIdValid = await commentsService.getOne({ _id }).then((data) => data.writerId);
        if (writerId !== writerIdValid) {
            res.status(400).json('자신의 댓글만 수정할 수 있습니다.');
            return;
        }

        const updateChange = {
            content,
            updatedAt: now.format('YYYY-MM-DD HH:mm:ss'),
        };

        const updatedComment = await commentsService.update({ _id, updateChange });
        if (!updateChange) {
            res.status(400).json('댓글 수정에 실패했습니다.');
            return;
        }

        res.status(200).json(updatedComment);
    } catch (error) {
        next(error);
    }
});

//게시글 댓글 리스트 가져오기
commentsRouter.get('/comments/:roomId', login_required, async function (req, res, next) {
    try {
        const { roomId } = req.params;
        const commentList = await commentsService.getAll({ roomId });
        if (!commentList) {
            res.status(500).json('댓글 목록을 가져오는데 실패했습니다.');
            return;
        }

        res.status(200).json(commentList);
    } catch (error) {
        next(error);
    }
});

// 댓글 하나 가져오기
commentsRouter.get('/comment/:_id', login_required, async function (req, res, next) {
    try {
        const { _id } = req.params;
        const comment = await commentsService.getOne({ _id });

        res.status(200).json(comment);
    } catch (error) {
        next(error);
    }
});

commentsRouter.delete('/comment/:_id', login_required, async function (req, res, next) {
    try {
        const writerId = req.currentUserId;
        const { _id } = req.params;
        if (!_id) {
            res.status(400).json('_id가 넘어오지 않았습니다.');
            return;
        }

        const writerIdValid = await commentsService.getOne({ _id }).then((data) => data.writerId);
        if (writerId !== writerIdValid) {
            res.status(400).json('자신의 댓글만 삭제할 수 있습니다.');
            return;
        }

        const deletedComment = await commentsService.delete({ _id });
        if (!deletedComment) {
            res.status(400).json('댓글 삭제에 실패했습니다.');
            return;
        }
        res.status(200).json({ result: 'success' });
    } catch (error) {
        next(error);
    }
});

export { commentsRouter };