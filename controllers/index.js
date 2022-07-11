import taskLists from "../models/taskLists.js";
import validate from "./validate.js";

export const createList = async (req, res) => {
  try {
    const newList = await taskLists.create(req.body);

    res.status(200).json(newList);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

export const createTask = async (req, res) => {
  try {
    const body = req.body;

    /* 
      converting indian format to ISO format
      first we get day month year from it
      and convert it to ISO format using javascript Date.
    */
    const [day, month, year] = body.dueDate.split("-");
    const date = new Date(year + "-" + month + "-" + day);
    body.dueDate = date.toISOString();

    /*
      below function cheks both the validation and return true if passed and false otherwise
      and if its false it also response to client with res function with appropriate
      message
    */
    if (!validate(date, body.period, body.periodType, res)) {
      return;
    }

    // if both validation passed then we find the list to insert the task
    const taskList = await taskLists.findOne({ _id: body.taskListId });

    //if no list found
    if (!taskList) {
      res.status(404).json({ message: "no list with that tasklist id" });
      return;
    }

    // push the task if list found
    taskList.tasks.push(body);

    await taskList.save();

    res.status(200).json(taskList);
    return;
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
};

export const taskList = async (req, res) => {
  const taskListId = req.params.taskListId;
  const query = req.query;

  try {
    // finding the list and 404 if not found
    const taskList = await taskLists.findOne({ _id: taskListId });

    if (taskList == null) {
      res.status(404).json({ message: "no task list with that id" });
      return;
    }

    // preparing result to pass to client
    let result = {};

    result.totalTasks = taskList.tasks.length;
    result.taskListName = taskList.name;
    result.description = taskList.description;

    // if searchtext is there then filtering tasks
    // accordingly or having all tasks otherwise
    if (query.search != undefined) {
      const searchText = query.search;
      result.tasks = taskList.tasks.filter((task) => task.taskName.includes(searchText) || task.description.includes(searchText));
    } else {
      result.tasks = taskList.tasks;
    }

    /*
      pagination
      slicing the tasks for the given page with given limit
      and also providing client the number of previous and next pages if there are any.
    */
    if (query.page != undefined && query.limit != undefined) {
      const page = parseInt(query.page);
      const limit = parseInt(query.limit);

      //calculating start and end index
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;

      //previous and next pages
      if (startIndex > 0) result.previousPages = startIndex / limit;
      if (endIndex < result.tasks.length) result.nextPages = Math.ceil((result.tasks.length - endIndex) / limit);

      //slicing the tasks
      result.tasks = result.tasks.slice(startIndex, endIndex);
    }

    // converting date format back to Indian from ISO using toLocaleDateString
    result.tasks = result.tasks.map((task) => {
      const indianDate = new Date(task.dueDate).toLocaleDateString("en-IN");
      return { ...task, dueDate: indianDate };
    });

    res.status(200).json(result);
    return;
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
};
