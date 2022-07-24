import React from 'react';
import './library.css';
import { api, SessionContext} from './library';

function Post({post}) {
  const [is_menu_open, setIs_menu_open] = React.useState(false)
  const y={}
  const [is_edit, setIs_edit] =React.useState(false)
  const [post_text, setPost_text]= React.useState(post.post_text)
  const [is_self_like, setIs_self_like]= React.useState(post.is_self_like)
  const [num_post_likes_user, setNum_post_likes_user]= React.useState(post.num_post_likes_user)
  const [is_self_dislike, setIs_self_dislike]= React.useState(post.is_self_dislike)
  const [all_comment_list, setAll_comment_list] = React.useState([])
  const [comment_text, setComment_text] = React.useState("")
  const [num_comments, setNum_comments]= React.useState(post.num_comments)
  const [isDeleted,  setIsDeleted] = React.useState(false)
  const [session, setSession] = React.useContext(SessionContext)


  const menu_open_close = function(){
    setIs_menu_open(!is_menu_open)
  }
  
  const post_edit = function(){
    setIs_edit(!is_edit)
    setIs_menu_open(false)
  }

  const post_update=function(){
    api('/post_update',{"post_text":post_text,"post_image": post.post_image , "post_id":post.id}, function(backend_output){
      setIs_edit(false)
    });
  }
  const like_on_post=function(){
    api('/liked_post', {"post_id":post.id, "is_self_like": is_self_like}, function(backend_output){
      if (is_self_like ==1){
        setIs_self_like (0)
        setNum_post_likes_user (num_post_likes_user -1)
      }
      else{
        setIs_self_like (1)
        setNum_post_likes_user (num_post_likes_user +1)
      }
    })  
  }
  const disliked_post=function(){
    api('/disliked_post', {"post_id":post.id, "is_self_dislike": is_self_dislike}, function(backend_output){
      if (is_self_dislike ==1){
        setIs_self_dislike (0)
        setNum_post_likes_user (num_post_likes_user + 1)
      }
      else{
        setIs_self_dislike(1)
        setNum_post_likes_user (num_post_likes_user - 1)
      }
    })  
  }

  const show_all_comments=function(){
    api('/show_all_comments', {"post_id":post.id}, function(backend_output){
      if("error" in backend_output) {
        alert(backend_output.error)
      }
      else{
        setAll_comment_list(backend_output.comment_list)
      }
    })  
  }

  const comment_now=function(){
    api('/comment', { "comment_text":comment_text, "post_id":post.id}, function(backend_output){
      setAll_comment_list(backend_output.comment_list)
      setNum_comments(backend_output.comment_list.length)
      setComment_text("") 
    })
  }

  const post_delete=function(){
    api('/post_delete',{"post_id":post.id}, function(backend_output){
      setIsDeleted(true)
    });

  }

  if(isDeleted){
    return (
      <div style={{ color: '#666', marginBottom: '25px', borderRadius: '4px', padding: '20px', boxShadow: '2px 2px 5px #888888', backgroundColor: '#fff', fontSize: '25px'}}>
        Post deleted
      </div>
    )
  }

  return (
    <div style={{color: '#333', marginBottom: '25px', borderRadius: '4px', padding: '20px', boxShadow: '2px 2px 5px #888888', backgroundColor: '#fff'}}>
      <div style={{boxSizing: 'border-box'}}>
        <div style={{boxSizing: 'border-box'}}>
          <div className="hsplit" style={{boxSizing: 'border-box', position: 'relative'}}>
            <div style={{boxSizing: 'border-box', marginRight: '10px'}}>
              <div style={{marginBottom: '6px'}}>
                <a href={"#/profile/" + post.user_id} style={{textDecoration: 'none'}}>
                  <div style={{overflow: 'hidden', whiteSpace: 'nowrap', borderRadius: '50%', verticalAlign: 'middle'}}>
                    <img style={{height: '40px', width: '40px', verticalAlign: 'middle'}} src={post.image} />
                  </div>
                </a>
              </div>
            </div>
            <div>
              <a href={"#/profile/" + post.user_id} style={{textDecoration: 'none'}}>
                <div style={{color: '#333', marginTop: '6px', fontWeight: 600, fontSize: '14px'}}> {post.name}</div>
              </a>
              <div style={{fontSize: '12px', fontWeight: 700, marginTop: '3px', color: '#666'}}> {post.post_time_str}</div>
            </div>
            <div style={{float: 'right', boxSizing: 'border-box'}}>
              <div style={{paddingTop: '5px', cursor: 'pointer'}} onClick={menu_open_close}>
                <span className="material-icons" style={{fontSize: '18px'}}>
                  more_vert
                </span>
              </div>
            </div>
            {/*  */}
            {is_menu_open && (
              <div className="post_menu">
                {session.login_key.id == post.user_id && ( 
                  <div className="logout_div" style={{borderBottom: 'solid #ccc 1px'}}>
                    <div style={{}} className="hsplit" onClick={post_edit}>
                        <div style={{}}>
                        <span className="material-icons" style={{fontSize: '18px'}}>
                            edit_note
                        </span>
                        </div>
                        <div style={{marginLeft: '5px',marginTop:'1px'}}>
                        Edit
                        </div>
                    </div>
                  </div>
                )}
                {session.login_key.id == post.user_id && (
                  <div className="logout_div" onClick={post_delete}>
                    <div style={{}} className="hsplit">
                        <div style={{}}>
                        <span className="material-icons" style={{fontSize:'18px'}}>
                            delete_outline
                        </span>
                        </div>
                        <div style={{marginLeft: '5px', marginTop: '1px'}}>
                        Delete
                        </div>
                    </div>
                  </div>
                )}
                <div className="logout_div" style={{borderTop:"solid #ccc 1px"}}>
                  <div style={{}} className="hsplit">
                    <div style={{}}>
                      <span className="material-icons" style={{fontSize: '18px'}}>
                        outlined_flag
                      </span>
                    </div>
                    <div style={{marginLeft: '5px', marginTop: '1px'}}>
                      Report
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div style={{boxSizing: 'border-box'}}> 
        {!is_edit && (
          <div style={{textAlign: 'justify', textJustify: 'inter-word', lineHeight: '1.6', fontSize: '14px'}}>
              {post_text.length != 0 && (
                <div style={{marginBottom: "10px"}}>
                  {post_text}
                </div>
                )    
              }
              {post.post_image.length != 0 && (
                <div style={{height: '250px', marginTop: '5px', textAlign: 'center', verticalAlign: 'middle'}}>
                  <hr />
                  <img src={post.post_image} style={{maxHeight: '250px', maxWidth: '100%', verticalAlign: 'middle'}} />
                </div> 
                ) 
              }
              <hr />
            </div>
        )}
        {is_edit && (
          <div>
            <div style={{boxSizing: 'border-box', width: 'calc(100% - 30px)'}}>
              <div style={{marginRight: '10px', textAlign: 'justify', textJustify: 'inter-word'}}>
                <textarea placeholder="Post..." rows={1} style={{outline: 'none', resize: 'none', padding: '10px', lineHeight: '20px', backgroundColor: '#eee', border: 'solid #eee 1px', width: '90%', borderRadius:'18px'}} value={post_text} onChange={(e) => setPost_text(e.target.value)}/>
              </div>
            </div>
            <div className="hsplit" style={{padding: '20px 10px', marginTop: '5px'}}>
              <div style={{boxSizing: 'border-box', width: '30px', marginTop: '6px'}}>
                <div>
                  <span className="material-icons" style={{fontSize: '30px', color: '#006666', cursor: 'pointer'}} onClick={post_update}>
                    arrow_circle_right
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
        </div>
        <div style={{boxSizing: 'border-box'}}> 
          <div style={{boxSizing: 'border-box', padding: '1px 15px'}} className="hsplit">
            <div style={{boxSizing: 'border-box'}}>
              <span className="material-icons" style={{color: '#006666'}}>
                recommend
              </span>
            </div>
            <div style={{boxSizing: 'border-box', padding: '4px', fontSize: '13px'}}>
              <span>{num_post_likes_user}</span>
            </div>
            <div style={{boxSizing: 'border-box', marginLeft: '7px', cursor: 'pointer'}}>
              <span className="material-icons" style={{color: '#006666'}} onClick={show_all_comments}>
                textsms
              </span>
            </div>
            <div style={{boxSizing: 'border-box', padding: '4px', fontSize: '13px'}}>
              <span>{num_comments}</span>
            </div>
          </div>
          <hr />
          <div className="hsplit" style={{padding: '10px 15px'}}>
            <div>
              <div className="hsplit" style={{cursor: 'pointer'}} onClick={like_on_post}>
                <div style={{color : is_self_like == 1 ? "#006666" : "#999"}}>
                  <span className="material-icons">
                    thumb_up_off_alt
                  </span>
                </div>
                <div className="like_name_div" style={{color : is_self_like == 1 ? "#006666" : "#999"}}><span style={{}}>
                    Like 
                  </span></div>
              </div>
            </div>
            <div style={{paddingLeft: '10px', boxSizing: 'border-box'}}>
              <div className="hsplit" style={{cursor: 'pointer'}} onClick={disliked_post}>
                <div style={{color : is_self_dislike == 1 ? "#006666":"#999"}}>
                  <span className="material-icons">
                    thumb_down_off_alt
                  </span>
                </div>
                <div className="dislike_name_div" style={{color : is_self_dislike == 1 ? "#006666" :"#999"}}>
                  <span style={{}}>
                    Dislike
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hsplit">
          <div style={{boxSizing: 'border-box'}}>
            <div style={{marginTop: '6px'}}>
              <div style={{}} className="hsplit">
                <div style={{textAlign: 'center', overflow: 'hidden', verticalAlign: 'middle', whiteSpace: 'nowrap', borderRadius: '50%'}}>
                  <img style={{height: '40px', width: '40px', verticalAlign: 'middle'}} src={post.image} />
                </div>
              </div>
            </div>
          </div>
          <div style={{boxSizing: 'border-box', width: 'calc(100% - 90px)', marginLeft: '15px'}}>
            <div style={{marginRight: '20px', textAlign: 'justify', textJustify: 'inter-word'}}>
              <textarea placeholder="Comments..." rows={1} 
                style={{outline: 'none', resize: 'none', padding: '10px',
                lineHeight: '20px', backgroundColor: '#eee', border: 'solid #eee 1px', width: '95%', borderRadius: '18px'}}
                value={comment_text} onChange={(e)=>setComment_text(e.target.value)}/>
            </div>
          </div>
          <div style={{boxSizing: 'border-box', width: '30px', marginTop: '6px'}}>
            <div>
              <span className="material-icons" style={{fontSize: '30px', color: '#006666', cursor: 'pointer'}} onClick={comment_now}>
                arrow_circle_right
              </span>
            </div>
          </div>
        </div>
        <hr />
        
        {all_comment_list.map((comment) => (
          <div key={comment.id} style={{boxSizing: 'border-box', marginTop: '6px'}}>	
            <div className="hsplit">
              <div style={{boxSizing: 'border-box', width: '60px'}}>
                <div style={{marginTop: '6px'}} className="hsplit">
                  <div style={{textAlign: 'center', overflow: 'hidden', verticalAlign: 'middle', whiteSpace: 'nowrap', borderRadius: '50%'}}>
                  <a href={"#/profile/" + comment.user_id} style={{textDecoration: 'none'}}>
                    <img style={{height: '40px', width: '40px', verticalAlign: 'middle'}} src={comment.image} />
                  </a>
                  </div>
                </div>
              </div>
              <div style={{boxSizing: 'border-box', width: 'calc(100% - 90px)'}}>
                <div>
                  <div style={{marginRight: '20px', display: 'inline-block', textAlign: 'justify', textJustify: 'inter-word', border: 'solid #eee 1px', backgroundColor: '#eee', marginTop: '5px', borderRadius: '8px', padding: '8px'}}>
                    <a href={"#/profile/" + comment.user_id} style={{textDecoration: 'none'}}>
                      <div style={{color: '#111', fontWeight: 600, fontSize: '12px'}}>
                        {comment.name}
                      </div>
                    </a>
                    <div style={{fontSize: '14px'}}>
                      {comment.comment_text}
                    </div>
                  </div>
                </div>
                <div style={{color: '#999', fontWeight: 600, fontSize: '9px', paddingLeft: '5px', paddingTop: '5px'}}>{comment.comment_time_str}</div>
              </div>
            </div>		
          </div>
        ))}
      </div>
    </div>

  );
}

export default Post;