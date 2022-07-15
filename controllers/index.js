import taskLists from "../models/taskLists.js";

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
    if (!req.isValid) {
      return res.status(400).json({ message: req.message });
    }

    const body = req.body;

    // finding the list to insert the task
    const taskList = await taskLists.findOne({ _id: body.taskListId });

    //if no list found
    if (!taskList) {
      return res.status(404).json({ message: "no list with that tasklist id" });
    }

    // push the task if list found
    taskList.tasks.push(body);

    await taskList.save();

    res.status(200).json(body);
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
      and also providing client the number of previous and 
      next pages if there are any.
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

export const getAllTasklists = async (req, res) => {
  try {
    let result = await taskLists.find();

    //returning only name,decription and id not the tasks of all lists
    result = result.map((tasklist) => {
      return { name: taskList.name, description: tasklist.description, id: taskList._id };
    });

    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({ message: "something went wrong" });
  }
};
