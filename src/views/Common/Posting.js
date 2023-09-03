import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import axios from "axios";
//import { storageService } from "fBase";
import Comment from "./Comment";
import { Grid, Paper } from "@material-ui/core";
import { Container, Col, Row } from "react-bootstrap";
import { makeStyles } from "@material-ui/core/styles";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Favorite from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import Icon from "@material-ui/core/Icon";
import CommentIcon from "@material-ui/icons/Comment";
import LocalHospitalIcon from "@material-ui/icons/LocalHospital";
import swal from "sweetalert";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Divider from "@mui/material/Divider";
import SendIcon from "@mui/icons-material/Send";
import ListIcon from "@mui/icons-material/List";
import TimeIcon from "@mui/icons-material/Timer";
import "../../assets/css/Posting.css";
import profileImg from "../../assets/img/announcement.png";
import { Button } from "reactstrap";
import { storageService } from "../../fBase";
import { ref, deleteObject } from "firebase/storage";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Box from "@material-ui/core/Box";
//게시글 내용
const useStyles = makeStyles((theme) => ({
  commentInput: {
    width: "100%",
    padding: "10px",
    border: "1px solid #e5e5e5",
    borderRadius: "0.3rem",
    "&:focus, &:active": {
      width: "100%",
      border: "2px solid #d6d6d6",
      borderRadius: "0.3rem",
      outline: "none",
    },
  },
}));

// [게시글] 컴포넌트
const Posting = ({}) => {
  const url = "http://localhost:5000";
  const { idx } = useParams(); // /articles/:idx와 동일한 변수명으로 데이터를 꺼낼 수 있습니다.
  const [loading, setLoading] = useState(true);
  const [board, setBoard] = useState({});

  const classes = useStyles();
  const [editing, setEditing] = useState(false);
  const [newPosting, setNewPosting] = useState();
  const [newTitle, setNewTitle] = useState();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commentCount, setCommentCount] = useState(0);
  const [likeCount, setLikeCount] = useState();
  const [likeState, setLikeState] = useState();
  const [attachment, setAttachment] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  // [READ] 게시글 DB에서 불러오기 핸들러
  const onReadBoard = async () => {
    await axios
      .get(url + "/api/articles/" + idx)
      .then((res) => {
        console.log("[READ] Article Reloading");
        //console.log("Response data type:", typeof res.data);

        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          const article = res.data[0];
          setBoard(article);
          console.log(article.content);
          setLikeState(Boolean(article.likepeople.find(liked)));
          setIsOwner(article.user_id === user._id);
          setCommentCount(article?.commentCount);
          setLikeCount(article?.likepeoplelength);
          setNewTitle(article?.title);
          setNewPosting(article?.content);
          setAttachment(article?.attachmentUrl);
          console.log(likeState);
          setLoading(false);
        } else {
          console.error("No article data received in the response.");
        }
      })
      .catch(() => {
        alert("[READ] response (x)");
      });
  };
  // [게시글] 목록 버튼 토글
  const toggleListing = () => navigate("/Announcement-Page");

  // [게시글] 수정 버튼 토글
  const toggleEditing = () => setEditing((prev) => !prev);

  // [UPDATE] 게시글 업데이트 핸들러
  const onUpdatePosting = async (event) => {
    const ok = await swal("Edit", {
      buttons: ["Cancel", "OK"],
    });
    if (ok) {
      event.preventDefault();
      await axios
        .post(url + "/api/articles/" + idx + "/update", {
          method: "POST",
          body: JSON.stringify({
            edittitle: newTitle,
            editContent: newPosting,
          }),
        })
        .then(() => {
          console.log("[UPDATE] Article Update");
          onReadComment();
          onReadBoard();
        })
        .catch(() => {
          alert("[UPDATE] response (x)");
        });
      setEditing(false);
    }
  };

  //[DELETE] 삭제 네비게이트
  const goList = (e) => {
    e.preventDefault();
    navigate("/AnnouncementPage");
  };

  // [DELETE] 게시글 삭제 핸들러
  const onDeletePosting = async () => {
    const ok = await swal("Delete", {
      buttons: ["Cancel", "OK"],
    });
    if (ok) {
      await axios
        .delete(url + "/api/articles/" + idx + "/delete")
        .then(() => {
          console.log("[DELETE] Article Delete");
          navigate("/Announcement-Page");
        })
        .catch(() => {
          //alert("[DELETE] response (x)");
        });
      if (attachment) {
        const attachmentRef = ref(storageService, attachment);
        await deleteObject(attachmentRef);
      }
    }
  };
  useEffect(() => {
    onReadComment();
    onReadBoard();
  }, [newComment, likeState]);

  // [게시글] 사용자 게시글 좋아요 클릭 여부 확인
  function liked(element) {
    if (element === user._id) {
      return true;
    } else {
      return false;
    }
  }

  // [CLICK] 게시글 좋아요 클릭 핸들러
  const onClickLike = async (event) => {
    setLikeCount(likeCount + 1);
    await axios
      .post(url + "/api/articles/" + idx + "/like/click", {
        method: "POST",
        body: JSON.stringify({
          likeuser: user._id,
        }),
      })
      .then(() => {
        console.log("[CLICK] Posting Like");
      })
      .catch(() => {
        alert("[CLICK] Posting Like Error");
      });
  };

  // [CANCEL] 게시글 좋아요 취소 핸들러
  const onCancelLike = async (event) => {
    if (likeCount >= 0) {
      setLikeCount(likeCount - 1);
    }
    await axios
      .post(url + "/api/articles/" + idx + "/like/cancel", {
        method: "POST",
        body: JSON.stringify({
          likeuser: user._id,
        }),
      })
      .then(() => {
        console.log("[CANCEL] Posting Like");
      })
      .catch(() => {
        alert("[CANCEL] Posting Like Error");
      });
  };

  // [좋아요] 버튼 핸들러
  const onLikeHandle = (event) => {
    setLikeState(event.target.checked);
    if (event.target.checked === true) {
      onClickLike();
    } else {
      onCancelLike();
    }
  };

  // 게시글(제목) 수정 작성 핸들러
  const onTitle = (event) => {
    const {
      target: { value },
    } = event;
    setNewTitle(value);
  };

  // 게시글(내용) 수정 작성 핸들러
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewPosting(value);
  };

  // 댓글 작성 핸들러
  const onComment = (event) => {
    const {
      target: { value },
    } = event;
    setComment(value);
  };

  // [CREATE] 댓글 생성 핸들러
  const onCreateComment = async (event) => {
    event.preventDefault();
    await axios
      .post(url + "/api/articles/" + idx + "/comment/create", {
        method: "POST",
        body: JSON.stringify({
          user_id: user._id,
          full_name: user.full_name,
          content: comment,
        }),
      })
      .then(() => {
        console.log("[CREATE] New Comment");
        setCommentCount(commentCount + 1);
        setNewComment(comment);
      })
      .catch(() => {
        alert("[CREATE] response (x)");
      });
    setComment("");
  };

  // [READ] 댓글 읽기 핸들러
  const onReadComment = async () => {
    await axios
      .get(url + "/api/articles/" + idx + "/comment/read", {})
      .then((response) => {
        response.data.reverse();
        setComments(response.data);
      })
      .catch(() => {
        alert("[READ] comment response (x)");
      });
  };

  // [DELETE] 댓글
  const onDeleteComment = async (comment_id) => {
    const ok = await swal("Delete?", {
      buttons: ["Cancel", "OK"],
    });
    if (ok) {
      await axios
        .delete(url + "/api/articles/" + idx + "/comment/" + comment_id)
        .then(() => {
          console.log("[DELETE] comment");
          setCommentCount(commentCount - 1);
          onReadComment();
        })
        .catch(() => {
          alert("[DELETE] comment response (x)");
          console.log(comment_id);
          console.log(idx);
        });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  const handleBackButtonClick = () => {
    navigate("/Announcement-page");
  };
  return (
    <>
      <div>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="back"
              onClick={handleBackButtonClick}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1 }}
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {board.title}
            </Typography>
          </Toolbar>
        </AppBar>
      </div>
      {editing ? (
        <>
          {isOwner && (
            <>
              <Paper
                style={{
                  border: "1px solid lightgray ",
                  marginBottom: "15px",
                  borderRadius: "1rem",
                  padding: isMobile ? "20px" : "110px", // 모바일 시 패딩 값을 줄임
                }}
              >
                <Grid item xs={12}>
                  <Row
                    style={{
                      margin: 0,
                      borderBottom: "1px solid lightgray",
                    }}
                  >
                    <Container style={{ width: "100%", height: "16vh" }}>
                      {/* 게시글 수정 모드 시 입력란 */}
                      <input
                        type="text"
                        value={newTitle}
                        onChange={onTitle}
                        placeholder="Title."
                        maxLength={100}
                        style={{
                          padding: "16px",
                          width: "100%",
                          height: "50%",
                          border: "1px solid lightgrey",
                          overflowWrap: "break-word",
                        }}
                      ></input>
                      <textarea
                        cols="40"
                        rows="5"
                        type="text"
                        value={newPosting}
                        onChange={onChange}
                        placeholder="Content"
                        maxLength={1000}
                        style={{
                          padding: "20px",
                          width: "100%",
                          height: "100%",
                          border: "1px solid lightgrey",
                          overflowWrap: "break-word",
                        }}
                      ></textarea>
                      {/* 게시글 수정 모드 시 취소, 완료 버튼 */}
                      <Button color="info" onClick={onUpdatePosting}>
                        submit
                      </Button>
                      <Button color="info" onClick={toggleEditing}>
                        Cancel
                      </Button>
                    </Container>
                  </Row>
                </Grid>
              </Paper>
            </>
          )}
        </>
      ) : (
        <>
          <Paper
            style={{
              border: "1px solid lightgray",
              marginBottom: "15px",
              borderRadius: "1rem",
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Grid container direction="row">
                  <Grid
                    item
                    xs={12}
                    sm={4}
                    style={{
                      fontWeight: "bold",
                      marginTop: "0.5rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <img
                      id="profileImg"
                      src={profileImg}
                      width="60vw"
                      height="60vh"
                      style={{
                        marginTop: 5,
                        marginBottom: 5,
                        marginLeft: 5,
                        marginRight: 20,
                      }}
                    />
                    <Link
                      style={{ color: "black" }}
                      to={{
                        pathname: "/Announcement-Page",
                        state: { targetUser: board?.posting_id },
                      }}
                    >
                      {board?.full_name}
                    </Link>
                    {board?.user_id && (
                      <>
                        <LocalHospitalIcon
                          style={{ marginLeft: 5, color: "green" }}
                        />
                      </>
                    )}
                  </Grid>

                  <Grid item xs={12} sm={4} />

                  <Grid
                    item
                    xs={6}
                    sm={2}
                    style={{
                      paddingTop: 15,
                      color: "lightgray",
                      fontSize: "1rem",
                    }}
                  >
                    <TimeIcon
                      style={{ marginLeft: "10px", color: "lightgray" }}
                    />
                    {board?.createdate}
                  </Grid>

                  <Grid item xs={6} sm={2}>
                    {isOwner && (
                      <>
                        <Box display="flex" justifyContent="space-between">
                          {/* 게시글 목록 버튼 */}
                          <IconButton
                            aria-label="list"
                            onClick={toggleListing}
                            style={{ color: "gray" }}
                          >
                            <ListIcon />
                          </IconButton>
                          {/* 게시글 수정 버튼 */}
                          <IconButton
                            aria-label="edit"
                            onClick={toggleEditing}
                            style={{ color: "gray" }}
                          >
                            <EditIcon />
                          </IconButton>
                          {/* 게시글 삭제 버튼 */}
                          <IconButton
                            aria-label="delete"
                            onClick={onDeletePosting}
                            style={{ color: "gray" }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </>
                    )}
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <Container>
                    {/* 게시글 제목 */}
                    <Box padding={2}>
                      <Typography variant="h5">{board.title}</Typography>
                    </Box>

                    <Divider />
                    {/* 게시글 내용 */}
                    <Box padding={2}>
                      <Typography variant="body1">{board.content}</Typography>
                    </Box>
                    {/* 게시글 첨부파일 포함 시 이미지 출력 */}
                    {attachment && (
                      <Box padding={2}>
                        <img src={attachment} width="100%" height="auto" />
                      </Box>
                    )}

                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={8} sm={10} />

                      <Grid item xs={2} sm={1}>
                        <Box display="flex" alignItems="center">
                          <CommentIcon />
                          <Box ml={1}>{commentCount}</Box>
                        </Box>
                      </Grid>

                      <Grid item xs={2} sm={1}>
                        <Col
                          item
                          xs={2}
                          style={{
                            margin: 0,
                            padding: 0,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          {/* 좋아요 */}
                          <FormControlLabel
                            style={{ margin: 0 }}
                            control={
                              <Checkbox
                                icon={<FavoriteBorder />}
                                checkedIcon={<Favorite />}
                                onChange={onLikeHandle}
                                checked={likeState}
                                name="likeState"
                              />
                            }
                          />
                          {/* 좋아요 수 */}
                          <span>{likeCount}</span>
                        </Col>
                      </Grid>
                    </Grid>

                    <Box
                      mt={2}
                      mb={2}
                      borderTop="1px solid lightgray"
                      pt={2}
                      pb={2}
                    >
                      {/* 댓글 목록 */}
                      {comments.map((comment) => (
                        <>
                          <Comment
                            key={comment.comment_id}
                            posting_id={comment.posting_id}
                            commentObj={comment}
                            content={comment.content}
                            isOwner={comment.user_id === user._id}
                            onReadComment={onReadComment}
                            commentCount={commentCount}
                            setCommentCount={setCommentCount}
                            onDeleteComment={() =>
                              onDeleteComment(comment.comment_id)
                            }
                          />
                          <Divider />
                        </>
                      ))}
                    </Box>

                    <Grid
                      container
                      spacing={2}
                      alignItems="center"
                      style={{ marginTop: 5, marginBottom: "1.2rem" }}
                    >
                      <Grid item xs={10} sm={10}>
                        {/* 댓글 입력란 */}
                        <input
                          type="text"
                          value={comment}
                          onChange={onComment}
                          placeholder="Comment"
                          style={{ width: "100%", overflowWrap: "break-word" }}
                        />
                      </Grid>
                      <Grid item xs={2} sm={2}>
                        {/* 댓글 등록 버튼 */}
                        <IconButton
                          color="secondary"
                          aria-label="Create"
                          onClick={onCreateComment}
                        >
                          <SendIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Container>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </>
      )}
    </>
  );
};

export default Posting;
