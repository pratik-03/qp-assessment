import bcrypt from 'bcrypt';
import User from '../model/user.model';

export const find = async (req: any, res: any) => {
    const query = req.query ? req.query : {};
    let options = {
        select: query.$select ? '' : '-created_at -updated_at',
        populate: { path: "role", select: "_id name" },
        sort: query.$sort ? JSON.parse(query.$sort) : { "name": 1 },
        limit: parseInt(query.$limit) || 100,
        page: parseInt(query.$page) || 1,
    };

    for (let key in query) {
        if (key.startsWith("$"))
            delete query[key];
    }

    const count = await User.countDocuments(query);
    var skip = (options.page - 1) * options.limit;

    return Promise.resolve(
        User.find(query)
            .collation({ locale: "en" })
            .sort(options.sort)
            .select(options.select)
            .limit(options.limit)
            .skip(skip)
            .populate(options.populate)
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
        return res.status(200).json(docs);
    });

}

export const get = async (req: any, res: any) => {
    Promise.resolve(User.findById(req.params.id).populate({ path: "role", select: "_id name" }).then((result: any) => {
        return res.status(200).json(result);
    }));
}

export const create = async (req: any, res: any) => {
    try {
        const { name, email, password, role } = req.body;

        let existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(500).json({ message: `${name} user already exists` });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        let data = { name, email, password: hashedPassword, role }

        let newUser = await User.create(data);
        return res.status(200).json({ message: 'User Created', user: newUser });

    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({ message: 'Error registering user' });
    }
}

export const update = async (req: any, res: any) => {
    let updatedUser = await User.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
    return res.status(200).json(updatedUser);
}

export const remove = async (req: any, res: any) => {
    Promise.resolve(User.findByIdAndDelete(req.params.id)).then((result: any) => {
        return res.status(200).json({ message: "User Deleted!" })
    })
}
