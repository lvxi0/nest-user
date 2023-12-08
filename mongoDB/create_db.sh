#!/bin/bash

# MongoDB connection string
MONGO_URI="mongodb://localhost:27017"

# Maximum number of connection attempts
MAX_ATTEMPTS=3

# Function to check MongoDB connection
check_connection() {
  if mongo $MONGO_URI --eval "db.runCommand({ ping: 1 })" 2>/dev/null; then
    return 0
  else
    return 1
  fi
}

# Attempt to connect to MongoDB with retries
attempts=1
while [ $attempts -le $MAX_ATTEMPTS ]; do
  if check_connection; then
    echo "Connected to MongoDB successfully."
    break
  else
    echo "Failed to connect to MongoDB (Attempt $attempts). Retrying..."
    ((attempts++))
    sleep 5  # Wait for 5 seconds before retrying
  fi
done

# If still not connected after maximum attempts, print an error message and exit
if [ $attempts -gt $MAX_ATTEMPTS ]; then
  echo "Error: Unable to connect to MongoDB after $MAX_ATTEMPTS attempts. Exiting."
  exit 1
fi

# Continue with the MongoDB script
mongo $MONGO_URI <<EOF

# Create the users collection
db.createCollection("users", {
  validator: {
    \$jsonSchema: {
      bsonType: "object",
      required: ["userId", "username", "password"],
      properties: {
        userId: {
          bsonType: "string",
          description: "UUID"
        },
        username: {
          bsonType: "string",
          description: "unique"
        },
        password: {
          bsonType: "string",
          description: "hashed password"
        }
      }
    }
  }
})

# Create unique indexes for the users collection
db.users.createIndex({ userId: 1 }, { unique: true })
db.users.createIndex({ username: 1 }, { unique: true })

# Create the login collection
db.createCollection("login", {
  validator: {
    \$jsonSchema: {
      bsonType: "object",
      required: ["userId", "isLocked", "lockedAt", "invalidLoginTimestamps"],
      properties: {
        userId: {
          bsonType: "string",
          description: "uuid"
        },
        isLocked: {
          bsonType: "bool"
        },
        lockedAt: {
          bsonType: "string",
          description: "unix timestamp"
        },
        invalidLoginTimestamps: {
          bsonType: "array",
          items: {
            bsonType: "string",
            description: "Must be a string"
          },
          description: "Array of unix timestamp"
        }
      }
    }
  }
})

# Create unique indexes for the login collection
db.login.createIndex({ userId: 1 }, { unique: true })

EOF

# Execute scripts with _script.js suffix
for script_file in *_script.js; do
  echo "Executing script: $script_file"
  mongo $MONGO_URI < "$script_file"
done