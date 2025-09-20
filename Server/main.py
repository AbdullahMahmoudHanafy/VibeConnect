from fastapi import FastAPI, HTTPException
import mysql.connector
app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],  # or restrict ["GET", "POST"]
    allow_headers=["*"],
)


def GetNewID(table_name, where="", id='id'):
    connection = mysql.connector.connect(
        user="root",
        password="WJ28@krhps",
        host="localhost",
        database="social_app",
        ssl_disabled=True
    )

    cursor = connection.cursor(dictionary=True)
    cursor.execute(f"SELECT * FROM {table_name} " + where)
    max_id = 0
    for row in cursor.fetchall():
        max_id = max(max_id, row[id])

    cursor.close(); connection.close()

    return max_id + 1

def GetConnection():
    try:
        connection = mysql.connector.connect(
            user="root",
            password="WJ28@krhps",
            host="localhost",
            database="social_app",
            ssl_disabled=True
        )
        cursor = connection.cursor(dictionary=True)  # ✅ dictionary mode
        print("✅ Database connected successfully")
    except mysql.connector.Error as e:
        print("❌ Database connection failed:", e)
        raise
    return connection, cursor

# base url
@app.get('/')
def MainRoot():
    return {
}



@app.get('/get-user_data')
def GetUserData(user_id:int):
    try:

        connection, cursor = GetConnection()

        cursor.execute(f"SELECT * from users WHERE id = {user_id}")
        data = cursor.fetchall()


        if len(data) == 0:
            raise HTTPException(status_code=400, detail="there's no user corresponding to this id")

        return data
    
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=f"Database error: {err}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close(); connection.close()



@app.post('/sign-up')
def SignUp(name:str, email:str, password:str):

    try:

        connection, cursor = GetConnection()

        new_id = GetNewID('users')

        cursor.execute(f"insert into users values({new_id}, '{name}', '{email}', '{password}');")
        connection.commit()

        return {"id": new_id}


    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=f"Database error: {err}")
    finally:
        cursor.close(); connection.close()



@app.get('/sign-in')
def SignIn(email:str, password:str):

    try:
        connection, cursor = GetConnection()

        cursor.execute("SELECT * FROM users")

        for row in cursor.fetchall():
            if row['email'] == email and row['password'] == password:
                id = row['id']
                return id
        
        raise HTTPException(status_code=404, detail="User not found")
    
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=f"Database error: {err}")
    finally:
        cursor.close(); connection.close()

@app.delete('/delete-user')
def DeleteUser(user_id:int):
    try:
        connection, cursor = GetConnection()

        cursor.execute("SELECT id from users WHERE id = %s", (user_id,))
        if(len(cursor.fetchall()) == 0):
            raise HTTPException(status_code=400, detail="there's no user correspond to this id")

        cursor.execute("DELETE FROM users WHERE id = %s", (user_id,))
        connection.commit()

        return f"user with id = {user_id} deleted successfully"
    
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=f"Database error: {err}")
    finally:
        cursor.close(); connection.close()


@app.post('/send-notification')
def SendNotification(receiver_id:int, content:str, friend_request_id = -1):

    try:    
        connection, cursor = GetConnection()

        notification_id = GetNewID('notifications')

        cursor.execute("INSERT INTO notifications (id, user_id, text, friend_request_id) values(%s,%s,%s,%s);", ((notification_id, receiver_id, content, friend_request_id)))

        connection.commit()

        return {"id": notification_id}

    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=f"Database error: {err}")
    finally:
        cursor.close(); connection.close()

@app.delete('/delete-notification')
def DeleteNotification(notification_id:int):
    try:
        connection, cursor = GetConnection()

        cursor.execute("SELECT id from notifications WHERE id = %s", (notification_id,))
        if(len(cursor.fetchall()) == 0):
            raise HTTPException(status_code=400, detail="there's no notification correspond to this id")

        cursor.execute("DELETE FROM notifications WHERE id = %s", (notification_id,))
        connection.commit()

        return f"notification deleted successfully"
    
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=f"Database error: {err}")
    finally:
        cursor.close(); connection.close()

@app.post('/mark-notification-as-read')
def MarkAsRead(notification_id:int):
    try:    
        connection, cursor = GetConnection()

        cursor.execute(f"update `notifications` set is_read = true where id = {notification_id};")

        connection.commit()

        return {"id": notification_id}

    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=f"Database error: {err}")
    finally:
        cursor.close(); connection.close()


@app.get('/get-notifications')
def GetNotifications(user_id:int):
    try:    
        connection, cursor = GetConnection()

        cursor.execute(f"SELECT * from notifications where user_id = {user_id} order by created_at DESC;")


        data = cursor.fetchall()
        if len(data) == 0:
            raise HTTPException(status_code=400, detail="there's no notification correspond to this id")


        return data

    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=f"Database error: {err}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close(); connection.close()
    

@app.post('/send-friend-request')
def SendFriendRequest(sender_id:int, receiver_id:int):

    try:
        connection, cursor = GetConnection()

        cursor.execute(
            """
            SELECT 
                friend_request_id, user_id 
            FROM
                notifications 
            WHERE 
                friend_request_id = %s AND user_id = %s 
                    OR
                friend_request_id = %s AND user_id = %s
            """,
            (sender_id, receiver_id, receiver_id, sender_id))
        
        if len(cursor.fetchall()) > 0:
            raise HTTPException(status_code=400, detail="friend request already exist")

        cursor.execute(f"SELECT name FROM users where id = {sender_id};")
        
        name_of_sender = cursor.fetchall()[0]['name']

        SendNotification(receiver_id, f"{name_of_sender} sent you a friend request", friend_request_id=sender_id)

        return "friend request sent successfully"
    
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=f"Database error: {err}")
    finally:
        cursor.close(); connection.close()

@app.delete('/delete-friend-request')
def DeleteFriendRequest(notification_id:int):
    return DeleteNotification(notification_id)

@app.post('/add-friend')
def AddFriend(sender_id:int, receiver_id:int):

    try:
        connection, cursor = GetConnection()

        cursor.execute(
            f"""
            SELECT
                * 
            FROM 
                friends
            WHERE 
                user_id = {sender_id} and friend_id = {receiver_id} OR
                user_id = {receiver_id} and friend_id = {sender_id}
            """
        )

        if len(cursor.fetchall()) > 0:
            raise HTTPException(status_code=400, detail="Friend already added!")

        cursor.execute(
            """
            SELECT 
                id
            FROM
                notifications 
            WHERE 
                friend_request_id = %s AND user_id = %s 
                    OR
                friend_request_id = %s AND user_id = %s
            """,
        (sender_id, receiver_id, receiver_id, sender_id))
        

        notifications = cursor.fetchall()

        if(len(notifications) == 0):
            raise HTTPException(status_code=400, detail="A friend request must be sent first!")

        notification_id = notifications[0]['id']
        DeleteFriendRequest(notification_id)

        cursor.execute(f"insert into friends values({sender_id}, {receiver_id});")
        connection.commit()


        return "Friend Added successfully!"

    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=f"Database error: {err}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close(); connection.close()

@app.delete('/delete-friend')
def DeleteFriend(sender_id:int, receiver_id:int):
    try:
        connection, cursor = GetConnection()

        cursor.execute("SELECT * from friends WHERE user_id = %s AND friend_id = %s OR user_id = %s AND friend_id = %s", (sender_id, receiver_id, receiver_id, sender_id))
        if(len(cursor.fetchall()) == 0):
            raise HTTPException(status_code=400, detail="there's no frindship correspond to these ids")

        cursor.execute(
        """
            DELETE FROM
                friends
            WHERE 
                user_id = %s AND friend_id = %s
                    OR
                user_id = %s AND friend_id = %s                
        """, 
        (sender_id, receiver_id, receiver_id, sender_id))
        connection.commit()

        return f"friendship ended successfully"
    
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=f"Database error: {err}")
    finally:
        cursor.close(); connection.close()

@app.get('/show-friends')
def ShowFriends(user_id:int):
    try:
        connection, cursor = GetConnection()

        cursor.execute(f"SELECT * FROM friends where user_id = {user_id} or friend_id = {user_id};")
        
        rows = cursor.fetchall()

        results = []

        for item in rows:
            if item['user_id'] == user_id:
                results.append(item['friend_id'])
            else:
                results.append(item['user_id'])
        

        return results
    
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=f"Database error: {err}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close(); connection.close()


@app.post('/follow')
def Follow(sender_id:int, receiver_id:int):

    try:
        connection, cursor = GetConnection()

        cursor.execute(f"insert into follows values ({sender_id}, {receiver_id});")
        connection.commit()

        return f"user with id {sender_id} now follows user with id {receiver_id}"

    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=f"Database error: {err}")
    finally:
        cursor.close(); connection.close()

@app.delete('/unfollow')
def Unfollow(sender_id:int, receiver_id:int):
    try:
        connection, cursor = GetConnection()

        cursor.execute("DELETE FROM follows WHERE follower_id = %s AND following_id = %s", (sender_id, receiver_id))
        connection.commit()

        return f"unfollow done successfully"
    
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=f"Database error: {err}")
    finally:
        cursor.close(); connection.close()
    
@app.get('/get-followers')
def GetFollowers(user_id:int):
    try:
        connection, cursor = GetConnection()

        cursor.execute(f"SELECT follower_id FROM follows WHERE following_id = {user_id};")
        data = cursor.fetchall()

        return data

    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=f"Database error: {err}")
    finally:
        cursor.close(); connection.close()

@app.get('/get-followings')
def GetFollowings(user_id:int):
    try:
        connection, cursor = GetConnection()

        cursor.execute(f"SELECT following_id FROM follows WHERE follower_id = {user_id};")
        data = cursor.fetchall()

        return data

    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=f"Database error: {err}")
    finally:
        cursor.close(); connection.close()


@app.post('/create-post')
def CreatePost(user_id:int, content:str):
    try:
        connection, cursor = GetConnection()

        new_id = GetNewID('posts')

        cursor.execute(
            "INSERT INTO posts (id, user_id, text) VALUES (%s, %s, %s)",
            (new_id, user_id, content)
        )       
        connection.commit()

        return f"user with id {user_id} created a new post successfully!"

    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=f"Database error: {err}")
    finally:
        cursor.close(); connection.close()

@app.delete('/delete-post')
def DeletePost(post_id:int):
    try:
        connection, cursor = GetConnection()


        cursor.execute("SELECT id from posts WHERE id = %s", (post_id,))
        if(len(cursor.fetchall()) == 0):
            raise HTTPException(status_code=400, detail="there's no post correspond to this id")

        cursor.execute("DELETE FROM posts WHERE id = %s", (post_id,))
        connection.commit()

        return f"post deleted successfully"
    
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=f"Database error: {err}")
    finally:
        cursor.close(); connection.close()
    
@app.get('/get-all-posts')
def GetAllPosts():
    try:
        connection, cursor = GetConnection()
        cursor.execute(f"SELECT * from posts order by created_at DESC;")
        data = cursor.fetchall()

        return data
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=f"Database error: {err}")
    finally:
        cursor.close(); connection.close()

@app.get('/get-user-posts')
def GetUserPosts(user_id:int):
    try:    
        connection, cursor = GetConnection()

        cursor.execute(f"SELECT * from posts where user_id = {user_id} order by created_at DESC;")

        data = cursor.fetchall()


        return data

    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=f"Database error: {err}")
    finally:
        cursor.close(); connection.close()


@app.get('/get-user-shared-posts')
def GetUserSharedPosts(user_id:int):
    try:    
        connection, cursor = GetConnection()
        
        query = f"SELECT * FROM posts WHERE id in (SELECT post_id FROM post_shares WHERE user_id = {user_id});"
        cursor.execute(query)

        data = cursor.fetchall()


        return data

    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=f"Database error: {err}")
    finally:
        cursor.close(); connection.close()


@app.post('/share-post')
def SharePost(user_id:int, post_id:int):
    try:
        connection, cursor = GetConnection()
        cursor.execute(f"INSERT INTO post_shares values({user_id}, {post_id});")
        connection.commit()

        return "post shared successfully"
    
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=f"Database error: {err}")
    finally:
        cursor.close(); connection.close()

@app.delete('/delete-post-share')
def DeleteShare(user_id:int, post_id:int):
    try:
        connection, cursor = GetConnection()

        cursor.execute("SELECT * from post_shares WHERE user_id = %s AND post_id = %s", (user_id, post_id))
        if(len(cursor.fetchall()) == 0):
            raise HTTPException(status_code=400, detail="there's no post share correspond to these ids")

        cursor.execute("DELETE FROM post_shares WHERE user_id = %s AND post_id = %s", (user_id, post_id))
        connection.commit()

        return f"share deleted successfully"
    
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=f"Database error: {err}")
    finally:
        cursor.close(); connection.close()

@app.post('/like-post')
def LikePost(user_id:int, post_id:int):
    try:
        connection, cursor = GetConnection()

        cursor.execute(f"INSERT INTO post_likes values({user_id}, {post_id});")
        connection.commit()

        return "Like created successfully"
    
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=f"Database error: {err}")
    finally:
        cursor.close(); connection.close()

@app.delete('/delete-post-like')
def DeleteLike(user_id:int, post_id:int):
    try:
        connection, cursor = GetConnection()

        cursor.execute("SELECT * from post_likes WHERE user_id = %s AND post_id = %s", (user_id, post_id))
        if(len(cursor.fetchall()) == 0):
            raise HTTPException(status_code=400, detail="there's no notification correspond to this id")


        cursor.execute("DELETE FROM post_likes WHERE user_id = %s AND post_id = %s", (user_id, post_id))
        connection.commit()

        return f"like deleted successfully"
    
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=f"Database error: {err}")
    finally:
        cursor.close(); connection.close()

@app.post('/create-comment')
def CreateComment(user_id:int, post_id:int, content:str):
    try:
        connection, cursor = GetConnection()

        new_id = GetNewID("comments")

        cursor.execute(
            "INSERT INTO comments(id, user_id, post_id, text) values(%s, %s, %s, %s);",
            (new_id, user_id, post_id, content)
        )
        connection.commit()

        return "comment created successfully"
    
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=f"Database error: {err}")
    finally:
        cursor.close(); connection.close()

@app.delete('/delete-comment')
def DeleteComment(comment_id:int, user_id:int, post_id:int):
    try:
        connection, cursor = GetConnection()

        cursor.execute("SELECT * from comments WHERE id = %s AND user_id = %s AND post_id = %s", (comment_id, user_id, post_id))
        if(len(cursor.fetchall()) == 0):
            raise HTTPException(status_code=400, detail="there's no comment correspond to this id")

        cursor.execute("DELETE FROM comments WHERE id = %s AND user_id = %s AND post_id = %s", (comment_id, user_id, post_id))
        connection.commit()

        return f"comment deleted successfully"
    
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=f"Database error: {err}")
    finally:
        cursor.close(); connection.close()

@app.get('/get-post-comments')
def GetPostComments(post_id:int):
    try:    
        connection, cursor = GetConnection()

        cursor.execute(f"SELECT * from comments where post_id = {post_id} order by created_at DESC;")

        data = cursor.fetchall()


        return data

    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=f"Database error: {err}")
    finally:
        cursor.close(); connection.close()


@app.post('/like-comment')
def LikeComent(user_id:int, comment_id:int, comment_user_id:int, post_id:int):
    try:
        connection, cursor = GetConnection()

        cursor.execute(f"INSERT INTO comment_likes values({user_id}, {post_id}, {comment_id}, {comment_user_id});")
        connection.commit()

        return "Like created successfully"
    
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=f"Database error: {err}")
    finally:
        cursor.close(); connection.close()

@app.delete('/delete-comment-like')
def DeleteCommentLike(user_id:int, comment_id:int, comment_user_id:int, post_id:int):
    try:
        connection, cursor = GetConnection()

        cursor.execute("SELECT * FROM comment_likes WHERE user_id = %s AND post_id = %s AND comment_id = %s AND comment_user_id = %s", (user_id, post_id, comment_id, comment_user_id))
        if(len(cursor.fetchall()) == 0):
            raise HTTPException(status_code=400, detail="there's no like correspond to this id")


        cursor.execute("DELETE FROM comment_likes WHERE user_id = %s AND post_id = %s AND comment_id = %s AND comment_user_id = %s", (user_id, post_id, comment_id, comment_user_id))
        connection.commit()

        return f"like deleted successfully"
    
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=f"Database error: {err}")
    finally:
        cursor.close(); connection.close()

# import google.generativeai as genai

# @app.post('/send-prompt')
# def SendPrompt(user_id:int, content:str):
#     try:

#         new_message_id = GetNewID('ai_chats', where=f"WHERE user_id = {user_id}", id='message_id') 
#         connection, cursor = GetConnection()

#         cursor.execute("INSERT INTO ai_chats values(%s, %s, %s, false);", (user_id, new_message_id, content))

#         connection.commit()

#         client = genai.Client(api_key="AIzaSyBNmRud-BbVedh2vPd6BPvHu4KSfC7rR7o") # to be updated

#         response = client.models.generate_content(
#             model='models/gemini-2.5-flash',
#             contents = content
#         )

#         cursor.execute(
#             "INSERT INTO ai_chats values (%s,%s,%s, true);",
#             (user_id, new_message_id + 1, response.text)
#         )
#         connection.commit()

#         return {
#             "response": response.text
#         }
    
#     except mysql.connector.Error as err:
#         raise HTTPException(status_code=500, detail=f"Database error: {err}")
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))
#     finally:
#         cursor.close(); connection.close()
import os
import google.generativeai as genai

genai.configure(api_key="AIzaSyBNmRud-BbVedh2vPd6BPvHu4KSfC7rR7o")

@app.post('/send-prompt')
def SendPrompt(user_id:int, content:str):
    try:
        new_message_id = GetNewID("ai_chats", where=f"WHERE user_id = {user_id}", id="message_id")
        connection, cursor = GetConnection()

        # Save user message
        cursor.execute("INSERT INTO ai_chats values(%s, %s, %s, false);", (user_id, new_message_id, content))
        connection.commit()

        # Get AI response
        try:
            model = genai.GenerativeModel("gemini-1.5-flash")
            response = model.generate_content(content)
            reply_text = response.text
        except Exception as e:
            reply_text = f"[AI Error]: {str(e)}"

        # Save AI response
        cursor.execute(
            "INSERT INTO ai_chats values (%s,%s,%s, true);",
            (user_id, new_message_id + 1, response.text)
        )
        connection.commit()

        return {"response": reply_text}

    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=f"Database error: {err}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        connection.close()


@app.delete('/delete-message')
def DeleteMessage(user_id:int, message_id:int):
    try:
        connection, cursor = GetConnection()

        cursor.execute("SELECT * FROM ai_chats WHERE user_id = %s AND message_id = %s", (user_id, message_id))
        if(len(cursor.fetchall()) == 0):
            raise HTTPException(status_code=400, detail="there's no message correspond to this id")


        cursor.execute("DELETE FROM ai_chats WHERE user_id = %s AND message_id = %s", (user_id, message_id))
        connection.commit()

        return f"message deleted successfully"
    
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=f"Database error: {err}")
    finally:
        cursor.close(); connection.close()