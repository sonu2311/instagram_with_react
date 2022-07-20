import React from 'react';
import './library.css';
import { api} from './library';
import { useParams } from 'react-router-dom';
import Post from './post';

function ProfilePage() {
  const {id} = useParams()
  const [userInfo, setUserInfo] = React.useState({})
  const [allPosts, setAllPosts]= React.useState([])
  const [followersList, setFollowersList] = React.useState([])
  const x={name:"mohit"}
  

  React.useEffect(()=>{

    api('/all_posts_by_user',{"user_id": id }, function(backend_output){
        setAllPosts(backend_output["list_of_all_posts"]) 
        setUserInfo(backend_output["list_of_user_info"][0]) 
      });  
  }, [id])

  const loadAllFollowers =function(){
    api('/all_followers',{"user_id":id }, function(backend_output){
      setFollowersList(backend_output["followers_list"])
      console.log("backend_output=====", backend_output)
    });
  }


  const friend_follow =function(){
    api('/friend_follow',{"user_id": id }, function(backend_output){
      if("error" in backend_output){
      alert(backend_output.error)
    }
    else{
      alert("Followed")
    } 
    });

  }
  return (
    <div className="hsplit" style={{boxSizing: 'border-box', marginTop: '25px'}}>
        <div style={{boxSizing: 'border-box'}} className="col-lg-4 col-md-4 col-sm-12 col-xs-12 ">
        <div style={{boxSizing: 'border-box'}}>
            <div style={{boxSizing: 'border-box', marginBottom: '5px', borderBottom: 'solid #eee 1px', color: '#333', padding: '8px', paddingLeft: '15px', fontSize: '18px', fontWeight: 700}}>{userInfo.name}</div>
            <div style={{boxSizing: 'border-box', textAlign: 'center'}}>
            <div style={{height: '250px', width: '250px', boxSizing: 'border-box', textAlign: 'center', verticalAlign: 'middle', borderRadius: '50%', overflow: 'hidden', whiteSpace: 'nowrap', display: 'inline-block'}}>
                <img style={{maxWidth: '100%', verticalAlign: 'middle'}} src={userInfo.image} />
            </div>
            </div>
            <hr />
            <div>
            <div className="hsplit" style={{padding: '10px 15px'}}>
                <div>
                <button className="login_button" onClick={loadAllFollowers}>
                    <div className="hsplit" style={{cursor: 'pointer'}}>
                    <div>
                        <span className="material-icons" style={{fontSize: '18px', verticalAlign: 'middle', marginRight: '10px'}}>
                        groups
                        </span>
                    </div>
                    <div><span style={{}}>
                        View all followers
                        </span></div>
                    </div>
                </button>
                </div>
                <div style={{paddingLeft: '10px', boxSizing: 'border-box'}}>
                <button className="login_button" onClick={friend_follow}>
                    <div className="hsplit" style={{cursor: 'pointer'}}>
                    <div>
                        <span className="material-icons" style={{fontSize: '18px', verticalAlign: 'middle', marginRight: '10px'}}>
                        person_add
                        </span>
                    </div>
                    <div>
                        <span style={{}}>
                        follow
                        </span>
                    </div>		
                    </div>
                </button>
                </div>
            </div>
            </div>
            <hr />
        </div>
        <div>
          {followersList.map((x)=>(
            <div key={x.id} style={{display: 'inline-block', width: '90px', boxSizing: 'border-box', borderRadius: '5px'}}>
              <div style={{textAlign: 'center'}}>
                <a href={"#/profile/" + x.user_id} style={{textDecoration: 'none'}}>
                  <div style={{textAlign: 'center', overflow: 'hidden', verticalAlign: 'middle', whiteSpace: 'nowrap'}}>
                    <img src={x.image} style={{width: '50px', height: '50px', verticalAlign: 'middle'}} />
                  </div>
                  <div style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{x.name} </div>
                </a>
              </div>
            </div>
          ))}

        </div>
        </div>
        <div className=" col-lg-8 col-md-8 col-sm-12 col-xs-12 " style={{border: 'solid #eee 1px', boxSizing: 'border-box'}}>
        {allPosts.length==0 && (
          <div style={{marginTop: '100px', padding: '126px', textAlign: 'center'}}>
            <div style={{fontSize: '18px', fontWeight: 700, color: '#333'}}> 
              This users have not posted   anything 
            </div>
          </div>
        )}
        <div style={{margin: '25px'}}>
            {allPosts.map((post)=>(
                <Post key={post.id} post={post}/>
                )
              )}
        </div>
      </div>
    </div>
    );
}


export default ProfilePage;