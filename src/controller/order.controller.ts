import Order from '../model/order.model';
import Grocery from '../model/grocery.model';
import mongoose from 'mongoose';

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

    const count = await Order.countDocuments(query);
    var skip = (options.page - 1) * options.limit;

    return Promise.resolve(
        Order.find(query)
            .collation({ locale: "en" })
            .sort(options.sort)
            .select(options.select)
            .limit(options.limit)
            .skip(skip)
            .populate({
                path: 'items',
                populate: 'grocery'
            })
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
    Promise.resolve(Order.findById(req.params.id).populate({
        path: 'items',
        populate: 'grocery'
    }).then((result: any) => {
        return res.status(200).json(result);
    }));
}

export const create = async (req: any, res: any) => {
    try {
        const { items } = req.body;

        // Calculate the total amount
        let totalAmount = 0;
        for (const item of items) {
            // Retrieve the grocery item from the database
            const groceryItem: any = await Grocery.findOne({ _id: new mongoose.Types.ObjectId(item.grocery) });

            if (groceryItem) {
                totalAmount += groceryItem.price * item.quantity;
            } else {
                return res.status(404).json({ message: `Grocery item with ID ${item.grocery} not found` });
            }
        }

        // Create the order
        let data = {
            items: items,
            amount: totalAmount,
            created_by: req.user._id
        }

        // Save the order to the database
        Order.create(data).then(result => {
            return res.status(201).json(result);
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server Error' });
    }
}

export const update = async (req: any, res: any) => {
    let updatedOrder = await Order.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }).populate('items.grocery created_by');
    return res.status(200).json(updatedOrder);
}

export const remove = async (req: any, res: any) => {
    Promise.resolve(Order.findByIdAndDelete(req.params.id)).then((result: any) => {
        return res.status(200).json({ message: "Order Deleted!" })
    })
}