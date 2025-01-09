import mongoose from "mongoose";
import mongooseAggregatePaginate  from "mongoose-aggregate-paginate-v2";

const videoSchema = new mongoose.Schema(
    {
        videofile : {
            type : String,
            required : true
        },
        thumbnail : {
            type : String,
            required : true
        },
        tital : {
            type : String,
            required : true
        },
        description : {
            type : Number,
            required : true
        },
        views : {
            type : Number,
            required : true
        },
        isPublished : {
            type : Boolean,
            required : true
        },
        owner : {
            type : String,
            required : true
        }


    },
    { timestamps: true }
)

videoSchema.Schema(mongooseAggregatePaginate)

export const Video = mongoose.model("Video", videoSchema)