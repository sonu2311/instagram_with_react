from flask_lib import FlaskLib
import database
import time
import os
import urllib.request
import math
import csv
import io


backend = FlaskLib()

if os.environ.get('SONU_BACKEND_ENV') == 'mohit':
	pass
else:
	db = database.Database(dbname='instagram', user="sonu", password="sonu_pass")


@backend.api('/api/multi')
def multi(d):
	return d['x']*d['y']

########
def Is_login(session):
  if "login_key" in session and "id" in session["login_key"]:
    return True
  else:
    return False


def login_id(session):
	if Is_login(session):
		return session["login_key"]["id"]
	else:
		return 0

def login_person_name(session):
	if Is_login(session):
		return session["login_key"]["name"]
	else:
		return ""

# sign_up ki api h
@backend.api('/sign_up')
def sign_up(frontend_dict, session):
	query1="select * from users where email={email}"
	output={}
	if('role' not in frontend_dict):
		frontend_dict['role']='USER'
	frontend_dict['account_status']='ACTIVE'
	if len(db.readQuery(query1, frontend_dict))==0:	
		query2 = "insert into users (name, email, phone, password,role, account_status ) values ({name}, {email}, {phone}, {password} ,{role}, {account_status}) "
		db.writeQuery(query2, frontend_dict)
		new_id = db.readQuery("select max(id) as new_id from users")[0]["new_id"]
		session['login_key'] = {"id": new_id,"role":frontend_dict["role"], "name": frontend_dict["name"]}
	else:
		output['error']="phle se email h"
	return output

# login_page ki api h
@backend.api('/login')
def login(frontend_dict, session):
	print(frontend_dict)
	query_output = db.readQuery("select * from users where email={email} AND password={password}", frontend_dict)
	print(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")	
	if len(query_output) != 0:
		print({"+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"})
		session['login_key'] = {"id": query_output[0]['id'],"role":query_output[0]['role'], "name": query_output[0]['name'], "image":query_output[0]['image']}
		return {}
	else:
		return {"error": "Email or password is incorrect."}

def preprocessOrderRow(row):
	row['post_time_str'] = time.strftime('%Y-%m-%d %I:%M:%S %p', time.localtime(row['post_time']))
	return row

def all_post_query():
	return """
	    SELECT 
	    	posts.*,
		    users.name,
		    users.image,
	    	COALESCE(num_comments_per_post.num_comments, 0) as num_comments, 
	     	COALESCE(num_likes_per_post.num_post_likes_user, 0) as num_post_likes_user,
	     	COALESCE(num_likes_per_post.is_self_like, 0) as is_self_like,
	     	COALESCE(num_dislikes_per_post.is_self_dislike, 0) as is_self_dislike 
	    FROM posts 
	    	LEFT JOIN users 
	    		ON users.id= posts.user_id 
	    	LEFT JOIN (
	    		SELECT 
	    			count(comment_text) AS num_comments, post_id 
	    		FROM comments 
	    		GROUP BY(post_id)
	    	) AS num_comments_per_post 
	    		ON num_comments_per_post.post_id = posts.id  
	    	LEFT JOIN (
	    		SELECT 
	    			count(user_id) AS num_post_likes_user ,
	    			max(CASE WHEN user_id ={login_user_id} THEN 1 ELSE 0 END) AS is_self_like, 
	    			post_id 
	    		FROM likes 
	    		GROUP BY(post_id)
	    	) AS num_likes_per_post 
	    		ON num_likes_per_post.post_id = posts.id
	    	LEFT JOIN (
	    		SELECT 
	    			max(CASE WHEN user_id ={login_user_id} THEN 1 ELSE 0 END) AS is_self_dislike, 
	    			post_id 
	    		FROM dislikes
	    		GROUP BY(post_id)
	    	)AS num_dislikes_per_post 
	    		ON num_dislikes_per_post.post_id = posts.id	
		
	"""

@backend.api('/all_posts')
def all_posts(frontend_dict, session):
	print(90899809, 89767868678, 8979798979)
	frontend_dict["login_user_id"]= login_id(session)
	query = "select users.image from users where id = {login_user_id}"
	profile_image= db.readQuery( query, frontend_dict)[0]["image"]

	query1 = all_post_query() + " ORDER BY id DESC"
	l1=db.readQuery( query1, frontend_dict)
	
	for i in l1:
		preprocessOrderRow(i)
	return  {"list_of_all_posts":l1, "users_profile_image": profile_image}

@backend.api('/post')
def post(frontend_dict, session):
	if Is_login(session):
		frontend_dict['user_id']=login_id(session)
		frontend_dict['post_time'] = int(time.time())
		query = "insert into posts (post_text,post_image, post_time, user_id) values ({post_text},{post_image}, {post_time}, {user_id}) "
		db.writeQuery(query, frontend_dict)
		return all_posts(frontend_dict, session)
	else:
		return {"error": "you are not login now please login first."}

def preprocessCommentRow(row):
	row['comment_time_str'] = time.strftime('%Y-%m-%d %I:%M:%S %p', time.localtime(row['comment_time']))
	return row

@backend.api('/show_all_comments')
def show_all_comments(frontend_dict , session):
	if Is_login(session):
		query="SELECT  comments.*, users.name , users.image FROM comments left join  users on comments.user_id= users.id WHERE comments.post_id={post_id} ORDER by id DESC "
		# query = """
		# 	SELECT * FROM 
		# 		comments 
		# 	WHERE 
		# 		comments.post_id={post_id} 
		# 	ORDER by id DESC 
		# """
		l=db.readQuery(query, frontend_dict)
		for i in l:
			preprocessCommentRow(i)
		return  {"comment_list": l}
	else:
		return {"error": "you are not login now please login first."}


@backend.api('/comment')
def comment(frontend_dict , session):
	if Is_login(session):
		frontend_dict['user_id']=login_id(session)
		frontend_dict['comment_time'] = int(time.time())
		query = "insert into comments (comment_text, post_id, comment_time, user_id) values ({comment_text},{post_id}, {comment_time}, {user_id}) "
		db.writeQuery(query, frontend_dict)

		content = login_person_name(session) + " commented on your post"

		query1=	"select id, posts.user_id from posts where posts.id={post_id}"

		post_krne_vale_ki_user_id= db.readQuery(query1, frontend_dict)[0]["user_id"]
		if frontend_dict['user_id']!= post_krne_vale_ki_user_id:

			new_notification(content, post_krne_vale_ki_user_id)

		return show_all_comments(frontend_dict , session)
	else:
		return {"error": "you are not login now please login first."}



@backend.api('/liked_post')
def liked_post(frontend_dict , session):
	print(12222,8789789, 9999999,frontend_dict , session )
	if Is_login(session):
		frontend_dict['user_id']=login_id(session)

		if frontend_dict['is_self_like']==0:
			query = "insert into likes (post_id , user_id) values ({post_id}, {user_id})"

			content = login_person_name(session) + " likes your post"

			query1=	"select id, posts.user_id from posts where posts.id={post_id}"

			post_krne_vale_ki_user_id= db.readQuery(query1, frontend_dict)[0]["user_id"]

			new_notification(content, post_krne_vale_ki_user_id)
		else:
			query = "delete from likes  where post_id= {post_id} AND user_id = {user_id}"

		db.writeQuery(query, frontend_dict)

		return {}

	else:
		return {"error": "you are not login now please login first."}


@backend.api('/disliked_post')
def disliked_post(frontend_dict , session):
	print(12222,8789789, 9999999,frontend_dict , session )
	if Is_login(session):
		frontend_dict['user_id']=login_id(session)
		if frontend_dict['is_self_dislike']==0:
			query = "insert into dislikes (post_id , user_id) values ({post_id}, {user_id})"
		else:
			query = "delete from dislikes  where post_id= {post_id} AND user_id = {user_id}"

		db.writeQuery(query, frontend_dict)
		return {}
	else:
		return {"error": "you are not login now please login first."}

@backend.api('/post_update')
def post_update(frontend_dict , session):
	print(66666666,777777777, 9999999,frontend_dict , session )
	if Is_login(session):
		frontend_dict['user_id']=login_id(session)
		query= """
			UPDATE posts
			SET  post_text = {post_text}, post_image ={post_image}
			WHERE posts.id = {post_id}
		"""

		db.writeQuery(query, frontend_dict)
		return {}
	else:
		return {"error": "you are not login now please login first."}


@backend.api('/post_delete')
def post_delete(frontend_dict , session):
	print(55555555,000000, 9999999,frontend_dict , session )
	if Is_login(session):
		query= """
			DELETE FROM posts 
			WHERE posts.id={post_id};
		"""

		db.writeQuery(query, frontend_dict)
		

		return all_posts(frontend_dict , session)
	else:
		return {"error": "you are not login now please login first."}


@backend.api('/all_posts_by_user')
def all_posts_by_user(frontend_dict , session):
	print(55555555,000000, 9999999,frontend_dict , session )
	if Is_login(session):
		frontend_dict["login_user_id"]= login_id(session)
		query=  all_post_query()+ """ 
			WHERE posts.user_id = {user_id} ORDER BY id DESC
		"""
		query2="select * from users where users.id={user_id}"
		return {"list_of_all_posts": db.readQuery(query, frontend_dict), "list_of_user_info":db.readQuery(query2, frontend_dict)}
	else:
		return {"error": "you are not login now please login first."}


@backend.api('/post_delete_in_profile_page')
def post_delete_in_profile_page(frontend_dict , session):
	print(55555555,000000, 9999999,frontend_dict , session )
	if Is_login(session):
		frontend_dict["login_user_id"]= login_id(session)
		query= """
			DELETE FROM posts 
			WHERE posts.id={post_id};
		"""
		db.writeQuery(query, frontend_dict)
		
		return all_posts_by_user(frontend_dict , session)
	else:
		return {"error": "you are not login now please login first."}

@backend.api('/friend_follow')
def friend_follow(frontend_dict , session):
	print(22333333, 444, 555,9999,frontend_dict , session )
	if Is_login(session):
		frontend_dict["login_user_id"]= login_id(session)
		
		query1="select * from follows where {login_user_id}=follows.user_id AND {user_id}=follows.follow_id "

		l= db.readQuery(query1, frontend_dict)
		
		if len(l)==0:
			if frontend_dict["login_user_id"] != frontend_dict["user_id"]:
				query= """
					insert into follows (user_id, follow_id ) values ({login_user_id}, {user_id});
					"""
				db.writeQuery(query, frontend_dict)

				content = login_person_name(session) + " followed you."

				jisko_follow_kiya_h_user_id= frontend_dict["user_id"]

				new_notification(content, jisko_follow_kiya_h_user_id)
				return {}
			else: 
				return {"error":"Are you following yourself ?"}

		else:
			return	{"error":"Already followed."}
			
	else:
		return {"error": "You are not login now please login first."}

	# if Is_login(session):
	# 	frontend_dict["login_user_id"]= login_id(session)
	# 	print("////////////")
	# 	print(frontend_dict)
	# 	print("////////////")

	# 	query1="select * from follows where {login_user_id}=follows.user_id AND {user_id}=follows.follow_id "

	# 	l= db.readQuery(query1, frontend_dict)

	# 	if len(l)==0:
	# 		return	{"error":"Already followed."}
			
	# 	if frontend_dict["login_user_id"] != frontend_dict["user_id"]:
	# 		return {"error":"Are you following yourself ?"}

	# 	query= """
	# 			insert into follows (user_id, follow_id ) values ({login_user_id}, {user_id});
	# 			"""
	# 		db.writeQuery(query, frontend_dict)
	# 	return {}

	# else:
	# 	return {"error": "You are not login now please login first."}

@backend.api('/all_followers')
def all_followers(frontend_dict , session):
	print(1211111111111, 444, 555,9999,frontend_dict , session )
	if Is_login(session):
		frontend_dict["input_se_aayi_hui_user_id"]= frontend_dict["user_id"]

		query= """
			SELECT 
				follows.*, users.name, users.image  
			FROM follows 
			LEFT JOIN 
				users ON  follows.user_id=users.id 
			WHERE 
				follows.follow_id= {input_se_aayi_hui_user_id}

		"""
		
		return {"followers_list": db.readQuery(query, frontend_dict) }
	else:
		return {"error": "you are not login now please login first."}


@backend.api('/my_all_followers')
def my_all_followers(frontend_dict , session):
	print(666666661, 444, 555,9999,frontend_dict , session )
	frontend_dict["user_id"]= login_id(session)
	return all_followers(frontend_dict , session)


# jiko hmne like, dislike, comment kiya h uska notification content or uski user_id  input me lega or notification ki table me insert kr dega.
def new_notification(content, user_id):
	d={"content": content, "user_id": user_id}
	query= """
		INSERT INTO notifications (content, user_id ) VALUES ({content}, {user_id})
	"""
	l = db.writeQuery(query, d)
	return l


@backend.api('/all_notifications')
def all_notifications(frontend_dict , session):
	if Is_login(session):
		frontend_dict["user_id"]= login_id(session)
		query= """

			SELECT * FROM notifications WHERE notifications.user_id = {user_id}  ORDER BY id DESC limit 5

		"""
		
		return {"notification_list": db.readQuery(query, frontend_dict) }
	else:
		return {"error": "you are not login now please login first."}

# frontent se jo login person h uski login id yha aayi h jika name h "user_ki_id". Is id ke according hm db ki users table se us login person ki detail nikalenge or return kr denge. 
#  Sample output:
# {"user_info": {"name": "Sonu", "email": "sonu2@gmail.com"}}
@backend.api('/get_user_detail')
def get_user_detail(frontend_dict, session):

	print(999999999999, 444, 555,9999,frontend_dict , session )
	l=db.readQuery("select id, name, phone,image, email, role from users where id ={user_ki_id}", frontend_dict)
	if len(l)!=0:
		return {"user_info": l[0]}
	else:
		return {"error":"id not correct"}

@backend.api('/update_user_details')
def update_user_details(frontend_dict, session):
	frontend_dict["user_id"] = login_id(session)
	query="update users set name = {name}, phone  = {phone}, image={image} where id={user_id}"
	l=db.writeQuery(query, frontend_dict)
	session["login_key"]["name"] = frontend_dict["name"]
	session["login_key"]["image"] = frontend_dict["image"]


@backend.api('/update_password')
def update_password(frontend_dict, session):
	print(frontend_dict)
	frontend_dict["user_id"] = login_id(session)
	if frontend_dict["new_password"] != frontend_dict["repeat_password"]:
		return {"error": "your password is different from repeat password"}
	l=db.readQuery("select id from users where password = {old_password} AND id={user_id}", frontend_dict)
	if len(l)==0:
		return {"error":"old password is not correct"}
	db.writeQuery("update users set password = {new_password} where id={user_id}",frontend_dict)
	return {}

@backend.api('/upload_image')
def upload_image(frontend_dict, session):
	v="data/image_"+str(int(time.time()))+"." + frontend_dict["filename"].split(".")[-1]
	f = open("../public/"+v , "wb")
	print(len(frontend_dict["image_file_content"]))
	r = urllib.request.urlopen(frontend_dict["image_file_content"])
	f.write(r.file.read())
	f.close()
	return {"uploaded_image_name": v}
# ////////
@backend.api('/my_name')
def my_name(d):
	time.sleep(1)
	return {"name": "I am React"}

@backend.api('/new_name')
def new_name(d):
	return {"name": "I am New Name"}

@backend.api('/sleep_for_5_seconds_and_return_name')
def sleep_for_5_seconds_and_return_name(d):
	time.sleep(5)
	return {"name": "[I am React][5s slept]"}


backend.run(port=5504)