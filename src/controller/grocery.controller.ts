import Grocery from '../model/grocery.model';

export const find = async (req: any, res: any) => {

    const query = req.query ? req.query : {};
    let options = {
        select: query.$select ? '' : '-created_at -updated_at',
        sort: query.$sort ? JSON.parse(query.$sort) : { "name": 1 },
        limit: parseInt(query.$limit) || 100,
        page: parseInt(query.$page) || 1,
    };

    for (let key in query) {
        if (key.startsWith("$"))
            delete query[key];
    }

    const count = await Grocery.countDocuments(query);
    var skip = (options.page - 1) * options.limit;

    return Promise.resolve(
        Grocery.find(query)
            .collation({ locale: "en" })
            .sort(options.sort)
            .select(options.select)
            .limit(options.limit)
            .skip(skip)
            .lean()
            .exec()
    ).then(function (data) {
        let docs = {
            docs: data,
            totalDocs: count,
            page: options.page,
            limit: options.limit,
            totalPages: Math.ceil(count / options.limit)
        };
        return res.status(200).json(docs);;
    });

}

export const get = async (req: any, res: any) => {
    Promise.resolve(Grocery.findById(req.params.id).then((result: any) => {
        return res.status(200).json(result);
    }));
}

export const create = async (req: any, res: any) => {
    let newRole = await Grocery.create(req.body);
    return res.status(200).json(newRole);
}

export const update = async (req: any, res: any) => {
    let updatedGrocery = await Grocery.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
    return res.status(200).json(updatedGrocery);
}

export const remove = async (req: any, res: any) => {
    Promise.resolve(Grocery.findByIdAndDelete(req.params.id)).then((result: any) => {
        return res.status(200).json({ message: "Grocery Deleted!" })
    })
}
