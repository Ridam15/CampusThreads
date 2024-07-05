const User = require("../models/User");

exports.getallFriends = async (req, res) => {
    try {
        const userid = req.user.id;
        const user = await User.findById(userid).populate('friends');
        const friends = user.friends;
        const friendNamesAndIds = friends.map(friend => ({
            id: friend._id,
            firstName: friend.firstName,
            lastName: friend.lastName,
        }));
        res.status(200).json({
            success: true,
            message: "All friends fetched successfully",
            data: friendNamesAndIds,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in getting friends list",
        });
    }
}

exports.getallreqsent = async (req, res) => {
    try {
        const userid = req.user.id;
        const user = await User.findById(userid).populate('requests_sent');
        const requests = user.requests_sent;
        const friendNamesAndIds = requests.map(friend => ({
            id: friend._id,
            firstName: friend.firstName,
            lastName: friend.lastName,
        }));
        // console.log(friendNamesAndIds);
        res.status(200).json({
            success: true,
            message: "All sent requests fetched successfully",
            data: friendNamesAndIds,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in getting all sent requests",
        });
    }
}

exports.getallreqrec = async (req, res) => {
    try {
        const userid = req.user.id;
        const user = await User.findById(userid).populate('requests_rec');
        const requests = user.requests_rec;
        const friendNamesAndIds = requests.map(friend => ({
            id: friend._id,
            firstName: friend.firstName,
            lastName: friend.lastName,
        }));
        res.status(200).json({
            success: true,
            message: "All received requests fetched successfully",
            data: friendNamesAndIds,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in getting all received requests",
        });
    }
}

exports.sendreq = async (req, res) => {
    try {
        const userid = req.user.id;
        const friendid = req.body.userId;
        const friend = await User.findById(friendid);
        const user = await User.findById(userid);

        if (user.friends.find((ele) => ele.equals(friendid))) {
            return res.json({
                success: false,
                message: "User is already a friend",
            });
        }

        if (user.requests_sent.find((ele) => ele.equals(friendid))) {
            return res.json({
                success: false,
                message: "User has already sent request",
            });
        }

        user.requests_sent.push(friendid);
        await user.save();
        friend.requests_rec.push(userid);
        await friend.save();

        return res.status(200).json({
            success: true,
            message: "Request sent successfully",
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error in sending",
        });
    }
}

exports.delreq = async (req, res) => {
    try {
        const userid = req.user.id;
        const friendid = req.body.id;

        const friend = await User.findById(friendid);

        const user = await User.findById(userid);
        // if(user.friends.find((ele) => ele===friendid)) {
        //     return res.json({
        //         success:false,
        //         message: "User is already a friend",
        //     });
        // }

        // if(user.requests_sent.find((ele) => ele===friendid)) {
        //     return res.json({
        //         success:false,
        //         message: "User has already sent request",
        //     });
        // }

        user.requests_sent.pull(friendid);
        await user.save();
        friend.requests_rec.pull(userid);
        await friend.save();

        return res.status(200).json({
            success: true,
            message: "Request deleted successfully",
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error in deleting request",
        });
    }
}

exports.acceptreq = async (req, res) => {
    try {
        const userid = req.user.id;
        const friendid = req.body.id;
        console.log(friendid);
        const friend = await User.findById(friendid);

        const user = await User.findById(userid);
        // if(user.friends.find((ele) => ele===friendid)) {
        //     return res.json({
        //         success:false,
        //         message: "User is already a friend",
        //     });
        // }

        if (!user.requests_rec.find((ele) => ele.equals(friendid))) {
            return res.json({
                success: false,
                message: "No request found",
            });
        }

        user.requests_rec.pull(friendid);
        await user.save().catch((err) => {
            console.error(err);
            throw err;
        });
        user.friends.push(friendid);
        await user.save();
        friend.requests_sent.pull(userid);
        await friend.save();
        friend.friends.push(userid);
        await friend.save();

        return res.status(200).json({
            success: true,
            message: "Request accepted successfully",
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error in accepting request",
        });
    }
}

exports.declinereq = async (req, res) => {
    try {
        const userid = req.user.id;
        const friendid = req.body.id;

        const friend = await User.findById(friendid);

        const user = await User.findById(userid);
        // if(user.friends.find((ele) => ele===friendid)) {
        //     return res.json({
        //         success:false,
        //         message: "User is already a friend",
        //     });
        // }

        if (!user.requests_rec.find((ele) => ele === friendid)) {
            return res.json({
                success: false,
                message: "No request found",
            });
        }

        user.requests_rec.pull(friendid);
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Request declined successfully",
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error in declining request",
        });
    }
}

exports.unFriend = async (req, res) => {
    try {
        const userid = req.user.id;
        const friendid = req.body.id;

        const friend = await User.findById(friendid);

        const user = await User.findById(userid);
        user.friends.pull(friendid);
        await user.save();
        friend.friends.pull(userid);
        await friend.save();

        return res.status(200).json({
            success: true,
            message: "Friend removed successfully",
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error in removing friend",
        });
    }
}