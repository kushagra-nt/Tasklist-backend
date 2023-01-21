# A simple tasklists backend server


tasklist schema:
-    tasks  an array of tasks intialized empty.
-    name -> list name, type String, and it is required
-    description -> type string, default value is empty string.
-    active -> boolean


4 api endpoints

1) http://localhost:5000/api/createtasklist
    
    method -> post
    
    required -> name
    optional -> description, active
    
    intialize tasklist with empty tasks array
    
    returns the new created tasklist
    

2) http://localhost:5000/api/createtask

    method -> post
    
    have to provide task name (taskName), description(description), due date(dueDate), period(period), period type(periodType), task list id(taskListId).
    due date must be in indian format.
    
    there are 2 validations as asked one for cheking if provided period is on period type format and other to check if due date is <= period.
    
    period type are as follows:
        
        1. monthly -> it must be in "mmm yyyy" format where mmm represnts month and yyyy year.
                        eg: "Nov 2022" , "mar 2019".
        
        2. yearly -> it must be in "yyyy" format where yyyy is year.
                        eg: "2020" , "2022"
                        
        3. quaterly -> it must be in "q-yyyy" where q represents quarter and must be ebtween 0-4
                        eg: "2-2022" , "1-2014"
    
    it returns the new task created
    
    tasks looks like this:
>       {  
>           taskName: list 1
>           description: complete module
>           dueDate: 2003-02-14T00:00:00.000Z
>           period: Nov 2002
>           periodType: monthly
>           taskListId: 62cb005b89036302b03cf081
>       }
    
 
3) http://localhost:5000/api/tasklist/<tasklistid>

    method -> get
    
    have to provide tasklist to be fetched after /tasklist
    
    return an object like this where each task due date is in indian format as asked.
>         {
>            "totalTasks": <total number of tasks in list>,
>            "taskListName": <name of list>,
>            "description": <description>,
>            "tasks": <an array of tasks>
>        }

    search query:
            key - search
            
            eg url : http://localhost:5000/api/tasklist/62cb005b89036302b03cf081?search=list
            
            return the same object but the filter tasks to only those which have search text either is name or description.
            
    pagination:
            keys - page,limit
            both keys are required, only one won't work
            
            eg url : http://localhost:5000/api/tasklist/62cb005b89036302b03cf081?page=2&limit=3
            
            return the same object but tasks array containes tasks for that page with that limit
            also contains two fields "previousPages", "nextPages" which contains the number of previous and next pages if there are any. 
        
    
    can combine both search and pagination:
            eg url : http://localhost:5000/api/tasklist/62cb005b89036302b03cf081?search=list&page=2&limit=3
            
    
        
4) http://localhost:5000/api/getalltasklists
    
    method -> GET
    return an array of all the tasklists present in database, and for each tasklists return only their name,description and id.
